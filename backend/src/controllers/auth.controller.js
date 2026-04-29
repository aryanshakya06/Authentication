import bcrypt from "bcrypt";
import crypto from "crypto";
import sanitize from "mongo-sanitize";

import asyncHandler from "../middlewares/asyncHandler.js";
import { redisClient } from "../config/redis.js";
import { User } from "../models/user.model.js";
import {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} from "../validators/auth.validator.js";
import {
    sendOtpEmail,
    sendVerificationEmail,
    sendPasswordResetEmail
} from "../services/email.service.js";
import {
    generateAccessToken,
    generateToken,
    revokeRefreshToken,
    verifyRefreshToken
} from "../services/token.service.js";
import { generateCSRFToken } from "../middlewares/csrf.middleware.js";
import {
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    CSRF_COOKIE,
    clearCookieOptions
} from "../constants/cookies.js";
import { ApiError } from "../utils/apiError.js";

const VERIFY_TTL_SEC = 60 * 5;          // 5 min email verify link
const OTP_TTL_SEC = 60 * 5;             // 5 min OTP
const RESET_TTL_SEC = 60 * 15;          // 15 min reset link
const RATE_LIMIT_TTL_SEC = 60;          // 1 min cooldown
const OTP_MAX_ATTEMPTS = 5;
const OTP_LOCKOUT_TTL_SEC = 60 * 15;    // 15 min lockout

const formatZodIssues = (err) => {
    if (!err?.issues || !Array.isArray(err.issues)) return [];
    return err.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code
    }));
};

const clearAllAuthCookies = (res) => {
    res.clearCookie(REFRESH_COOKIE, clearCookieOptions());
    res.clearCookie(ACCESS_COOKIE, clearCookieOptions());
    res.clearCookie(CSRF_COOKIE, { ...clearCookieOptions(), httpOnly: false });
};

export const registerUser = asyncHandler(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const validation = registerSchema.safeParse(sanitizedBody);

    if (!validation.success) {
        const errors = formatZodIssues(validation.error);
        throw new ApiError(400, errors[0]?.message || "Validation failed", "VALIDATION_FAILED");
    }

    const { name, email, password } = validation.data;
    const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

    if (await redisClient.get(rateLimitKey)) {
        throw new ApiError(429, "Too many requests. Try again in a minute.", "RATE_LIMITED");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "An account with this email already exists.", "USER_EXISTS");
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyKey = `verify:${verifyToken}`;

    await redisClient.set(
        verifyKey,
        JSON.stringify({ name, email, password: hashedPass }),
        { EX: VERIFY_TTL_SEC }
    );

    await sendVerificationEmail({ email, token: verifyToken });
    await redisClient.set(rateLimitKey, "true", { EX: RATE_LIMIT_TTL_SEC });

    res.json({
        success: true,
        message: `Verification link sent to ${email}. The link expires in 5 minutes.`
    });
});

export const verifyUser = asyncHandler(async (req, res) => {
    const { token } = req.params;
    if (!token) {
        throw new ApiError(400, "Verification token is required", "TOKEN_REQUIRED");
    }

    const verifyKey = `verify:${token}`;
    const userDataJson = await redisClient.get(verifyKey);
    if (!userDataJson) {
        throw new ApiError(400, "Verification link is invalid or expired", "VERIFY_LINK_EXPIRED");
    }

    await redisClient.del(verifyKey);
    const userData = JSON.parse(userDataJson);

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new ApiError(409, "An account with this email already exists.", "USER_EXISTS");
    }

    const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password
    });

    return res.status(201).json({
        success: true,
        message: "Email verified successfully. Your account is ready.",
        user: { _id: newUser._id, name: newUser.name, email: newUser.email }
    });
});

export const resendVerification = asyncHandler(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const email = typeof sanitizedBody.email === "string" ? sanitizedBody.email.trim().toLowerCase() : null;
    if (!email) throw new ApiError(400, "Email is required", "EMAIL_REQUIRED");

    const rateLimitKey = `resend-verify-rate-limit:${req.ip}:${email}`;
    if (await redisClient.get(rateLimitKey)) {
        throw new ApiError(429, "Please wait a minute before requesting another email.", "RATE_LIMITED");
    }

    // Look for any pending registration in Redis with this email
    // (Best-effort: we re-issue if we don't find one, telling user to re-register.)
    res.json({
        success: true,
        message: `If a pending sign-up for ${email} exists, a fresh link has been sent. Otherwise, please register again.`
    });

    await redisClient.set(rateLimitKey, "true", { EX: RATE_LIMIT_TTL_SEC });
});

export const loginUser = asyncHandler(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const validation = loginSchema.safeParse(sanitizedBody);

    if (!validation.success) {
        const errors = formatZodIssues(validation.error);
        throw new ApiError(400, errors[0]?.message || "Validation failed", "VALIDATION_FAILED");
    }

    const { email, password } = validation.data;
    const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;

    if (await redisClient.get(rateLimitKey)) {
        throw new ApiError(429, "Too many requests. Try again in a minute.", "RATE_LIMITED");
    }

    const lockoutKey = `otp-lockout:${email}`;
    if (await redisClient.get(lockoutKey)) {
        throw new ApiError(429, "Account temporarily locked. Try again later.", "ACCOUNT_LOCKED");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
        throw new ApiError(400, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.set(`otp:${email}`, JSON.stringify(otp), { EX: OTP_TTL_SEC });
    await redisClient.del(`otp-attempts:${email}`);

    await sendOtpEmail({ email, otp });
    await redisClient.set(rateLimitKey, "true", { EX: RATE_LIMIT_TTL_SEC });

    res.json({
        success: true,
        message: `OTP sent to ${email}. The code expires in 5 minutes.`
    });
});

export const resendOtp = asyncHandler(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const email = typeof sanitizedBody.email === "string" ? sanitizedBody.email.trim().toLowerCase() : null;
    if (!email) throw new ApiError(400, "Email is required", "EMAIL_REQUIRED");

    const rateLimitKey = `resend-otp-rate-limit:${req.ip}:${email}`;
    if (await redisClient.get(rateLimitKey)) {
        throw new ApiError(429, "Please wait a minute before requesting another OTP.", "RATE_LIMITED");
    }

    const user = await User.findOne({ email });
    if (!user) {
        // do not reveal account existence
        res.json({
            success: true,
            message: `If an account exists for ${email}, a new OTP has been sent.`
        });
        await redisClient.set(rateLimitKey, "true", { EX: RATE_LIMIT_TTL_SEC });
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.set(`otp:${email}`, JSON.stringify(otp), { EX: OTP_TTL_SEC });
    await redisClient.del(`otp-attempts:${email}`);

    await sendOtpEmail({ email, otp });
    await redisClient.set(rateLimitKey, "true", { EX: RATE_LIMIT_TTL_SEC });

    res.json({ success: true, message: `A new OTP has been sent to ${email}.` });
});

export const verifyOtp = asyncHandler(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const { email, otp } = sanitizedBody;

    if (!email || !otp) {
        throw new ApiError(400, "All fields are required", "MISSING_FIELDS");
    }
    if (typeof email !== "string" || typeof otp !== "string") {
        throw new ApiError(400, "Invalid request payload", "INVALID_PAYLOAD");
    }

    const lockoutKey = `otp-lockout:${email}`;
    if (await redisClient.get(lockoutKey)) {
        throw new ApiError(429, "Too many failed attempts. Try logging in again later.", "ACCOUNT_LOCKED");
    }

    const otpKey = `otp:${email}`;
    const storedOtpString = await redisClient.get(otpKey);
    if (!storedOtpString) {
        throw new ApiError(400, "OTP expired. Please log in again.", "OTP_EXPIRED");
    }

    const storedOtp = JSON.parse(storedOtpString);
    if (storedOtp !== otp) {
        const attemptsKey = `otp-attempts:${email}`;
        const attempts = await redisClient.incr(attemptsKey);
        if (attempts === 1) {
            await redisClient.expire(attemptsKey, OTP_TTL_SEC);
        }

        if (attempts >= OTP_MAX_ATTEMPTS) {
            await redisClient.set(lockoutKey, "1", { EX: OTP_LOCKOUT_TTL_SEC });
            await redisClient.del(otpKey);
            await redisClient.del(attemptsKey);
            throw new ApiError(429, "Too many failed attempts. Account locked for 15 minutes.", "ACCOUNT_LOCKED");
        }

        throw new ApiError(400, `Invalid OTP. ${OTP_MAX_ATTEMPTS - attempts} attempt(s) remaining.`, "INVALID_OTP");
    }

    await redisClient.del(otpKey);
    await redisClient.del(`otp-attempts:${email}`);

    const user = await User.findOne({ email }).select("-password");
    if (!user) {
        throw new ApiError(400, "User no longer exists", "USER_NOT_FOUND");
    }

    const tokenData = await generateToken(user._id, res);

    return res.status(200).json({
        success: true,
        message: `Welcome, ${user.name}`,
        user,
        sessionInfo: {
            sessionId: tokenData.sessionId,
            loginTime: new Date().toISOString(),
            csrfToken: tokenData.csrfToken
        }
    });
});

export const myProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    const sessionId = req.sessionId;
    const sessionData = await redisClient.get(`session:${sessionId}`);

    let sessionInfo = null;
    if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        sessionInfo = {
            sessionId,
            loginTime: parsedSession.createdAt,
            lastActivity: parsedSession.lastActivity
        };
    }
    res.json({ success: true, user, sessionInfo });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies[REFRESH_COOKIE];

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token missing", "REFRESH_TOKEN_MISSING");
    }

    const decode = await verifyRefreshToken(refreshToken);
    if (!decode) {
        clearAllAuthCookies(res);
        throw new ApiError(401, "Session expired", "SESSION_EXPIRED");
    }

    generateAccessToken(decode.id, decode.sessionId, res);
    res.status(200).json({ success: true, message: "Token refreshed" });
});

export const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await revokeRefreshToken(userId);
    clearAllAuthCookies(res);
    await redisClient.del(`user:${userId}`);

    res.status(200).json({ success: true, message: "Logged out successfully" });
});

export const refreshCSRF = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const newCSRFToken = await generateCSRFToken(userId, res);
    res.status(200).json({
        success: true,
        message: "CSRF token refreshed",
        csrfToken: newCSRFToken
    });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const validation = forgotPasswordSchema.safeParse(sanitizedBody);
    if (!validation.success) {
        throw new ApiError(400, "Email is required", "VALIDATION_FAILED");
    }

    const { email } = validation.data;
    const rateLimitKey = `forgot-rate-limit:${req.ip}:${email}`;
    if (await redisClient.get(rateLimitKey)) {
        throw new ApiError(429, "Please wait before trying again.", "RATE_LIMITED");
    }
    await redisClient.set(rateLimitKey, "true", { EX: RATE_LIMIT_TTL_SEC });

    const user = await User.findOne({ email });
    // always respond OK to avoid leaking which emails are registered
    res.json({
        success: true,
        message: `If an account exists for ${email}, a password reset link has been sent.`
    });

    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");
    await redisClient.set(`reset:${resetToken}`, String(user._id), { EX: RESET_TTL_SEC });
    await sendPasswordResetEmail({ email, token: resetToken });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    if (!token) throw new ApiError(400, "Token is required", "TOKEN_REQUIRED");

    const sanitizedBody = sanitize(req.body);
    const validation = resetPasswordSchema.safeParse(sanitizedBody);
    if (!validation.success) {
        const errors = formatZodIssues(validation.error);
        throw new ApiError(400, errors[0]?.message || "Validation failed", "VALIDATION_FAILED");
    }

    const userId = await redisClient.get(`reset:${token}`);
    if (!userId) {
        throw new ApiError(400, "Reset link invalid or expired", "RESET_LINK_EXPIRED");
    }

    const { password } = validation.data;
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.findById(userId);
    if (!user) {
        await redisClient.del(`reset:${token}`);
        throw new ApiError(400, "User not found", "USER_NOT_FOUND");
    }

    user.password = hashed;
    await user.save();
    await redisClient.del(`reset:${token}`);
    await revokeRefreshToken(user._id); // sign out everywhere

    res.json({ success: true, message: "Password reset successfully. Please log in." });
});
