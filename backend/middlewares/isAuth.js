import jwt from 'jsonwebtoken';
import { redisClient } from '../index.js';
import { User } from '../models/User.js';
import { isSessionActive } from '../config/generateToken.js';

export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to continue",
                code: "NOT_AUTHENTICATED"
            });
        }

        let decodedData;
        try {
            decodedData = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Access token expired",
                    code: "ACCESS_TOKEN_EXPIRED"
                });
            }
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
                code: "ACCESS_TOKEN_INVALID"
            });
        }

        const sessionActive = await isSessionActive(decodedData.id, decodedData.sessionId);
        if (!sessionActive) {
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            res.clearCookie("csrfToken");
            return res.status(401).json({
                success: false,
                message: "Session expired",
                code: "SESSION_EXPIRED"
            });
        }

        req.sessionId = decodedData.sessionId;

        const cacheUser = await redisClient.get(`user:${decodedData.id}`);
        if (cacheUser) {
            req.user = JSON.parse(cacheUser);
            return next();
        }

        const user = await User.findById(decodedData.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists",
                code: "USER_NOT_FOUND"
            });
        }

        await redisClient.setEx(`user:${user._id}`, 3600, JSON.stringify(user));

        req.user = user;
        next();
    } catch (err) {
        console.error("isAuth middleware error:", err);
        return res.status(500).json({
            success: false,
            message: "Authentication check failed",
            code: "AUTH_INTERNAL_ERROR"
        });
    }
}

export const authorizeAdmin = async (req, res, next) => {
    const user = req.user;

    if (!user || user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Not authorized for this action",
            code: "FORBIDDEN"
        });
    }

    next();
}
