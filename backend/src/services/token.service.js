import jwt from "jsonwebtoken";
import crypto from "crypto";
import { redisClient } from "../config/redis.js";
import { generateCSRFToken, revokeCSRFToken } from "../middlewares/csrf.middleware.js";
import { env } from "../config/env.js";
import {
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    ACCESS_TTL_MS,
    REFRESH_TTL_SEC,
    accessCookieOptions,
    refreshCookieOptions
} from "../constants/cookies.js";

export const generateToken = async (id, res) => {
    const sessionId = crypto.randomBytes(16).toString("hex");

    const accessToken = jwt.sign({ id, sessionId }, env.jwt.accessSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id, sessionId }, env.jwt.refreshSecret, { expiresIn: "7d" });

    const refreshTokenKey = `refresh_token:${id}`;
    const activeSessionKey = `active_session:${id}`;
    const sessionDataKey = `session:${sessionId}`;

    const existingSession = await redisClient.get(activeSessionKey);
    if (existingSession) {
        await redisClient.del(`session:${existingSession}`);
        await redisClient.del(refreshTokenKey);
    }

    const sessionData = {
        userId: id,
        sessionId,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    };

    await redisClient.setEx(refreshTokenKey, REFRESH_TTL_SEC, refreshToken);
    await redisClient.setEx(sessionDataKey, REFRESH_TTL_SEC, JSON.stringify(sessionData));
    await redisClient.setEx(activeSessionKey, REFRESH_TTL_SEC, sessionId);

    res.cookie(ACCESS_COOKIE, accessToken, accessCookieOptions());
    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());

    const csrfToken = await generateCSRFToken(id, res);

    return { accessToken, refreshToken, csrfToken, sessionId };
};

export const verifyRefreshToken = async (refreshToken) => {
    try {
        const decode = jwt.verify(refreshToken, env.jwt.refreshSecret);

        const storedToken = await redisClient.get(`refresh_token:${decode.id}`);
        if (!storedToken || storedToken !== refreshToken) return null;

        const activeSessionId = await redisClient.get(`active_session:${decode.id}`);
        if (activeSessionId !== decode.sessionId) return null;

        const sessionData = await redisClient.get(`session:${decode.sessionId}`);
        if (!sessionData) return null;

        const parsedSessionData = JSON.parse(sessionData);
        parsedSessionData.lastActivity = new Date().toISOString();

        await redisClient.setEx(
            `session:${decode.sessionId}`,
            REFRESH_TTL_SEC,
            JSON.stringify(parsedSessionData)
        );

        return decode;
    } catch (err) {
        return null;
    }
};

export const generateAccessToken = (id, sessionId, res) => {
    const accessToken = jwt.sign({ id, sessionId }, env.jwt.accessSecret, { expiresIn: "15m" });
    res.cookie(ACCESS_COOKIE, accessToken, accessCookieOptions());
    return accessToken;
};

export const revokeRefreshToken = async (userId) => {
    const activeSessionId = await redisClient.get(`active_session:${userId}`);
    await redisClient.del(`active_session:${userId}`);
    await redisClient.del(`refresh_token:${userId}`);

    if (activeSessionId) {
        await redisClient.del(`session:${activeSessionId}`);
    }
    await revokeCSRFToken(userId);
};

export const isSessionActive = async (userId, sessionId) => {
    const activeSessionId = await redisClient.get(`active_session:${userId}`);
    return activeSessionId === sessionId;
};
