import crypto from "crypto";
import { redisClient } from "../config/redis.js";
import { CSRF_COOKIE, CSRF_TTL_SEC, csrfCookieOptions } from "../constants/cookies.js";

export const generateCSRFToken = async (userId, res) => {
    const csrfToken = crypto.randomBytes(32).toString("hex");
    const csrfKey = `csrf:${userId}`;
    await redisClient.setEx(csrfKey, CSRF_TTL_SEC, csrfToken);

    res.cookie(CSRF_COOKIE, csrfToken, csrfCookieOptions());

    return csrfToken;
};

export const verifyCSRFToken = async (req, res, next) => {
    try {
        if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
            return next();
        }

        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
                code: "NOT_AUTHENTICATED"
            });
        }

        const clientToken =
            req.headers["x-csrf-token"] ||
            req.headers["x-xsrf-token"] ||
            req.headers["csrf-token"];

        if (!clientToken) {
            return res.status(403).json({
                success: false,
                message: "CSRF token missing. Please refresh the page.",
                code: "CSRF_TOKEN_MISSING"
            });
        }

        const csrfKey = `csrf:${userId}`;
        const storedToken = await redisClient.get(csrfKey);

        if (!storedToken) {
            return res.status(403).json({
                success: false,
                message: "CSRF token expired. Please try again.",
                code: "CSRF_TOKEN_EXPIRED"
            });
        }

        if (storedToken !== clientToken) {
            return res.status(403).json({
                success: false,
                message: "Invalid CSRF token. Please refresh the page.",
                code: "CSRF_TOKEN_INVALID"
            });
        }

        next();
    } catch (err) {
        console.error("CSRF verification error:", err);
        return res.status(500).json({
            success: false,
            message: "CSRF verification failed",
            code: "CSRF_VERIFICATION_ERROR"
        });
    }
};

export const revokeCSRFToken = async (userId) => {
    const csrfKey = `csrf:${userId}`;
    await redisClient.del(csrfKey);
};

export const refreshCSRFToken = async (userId, res) => {
    await revokeCSRFToken(userId);
    return generateCSRFToken(userId, res);
};
