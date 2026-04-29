import { Router } from "express";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import { redisClient } from "../config/redis.js";
import mongoose from "mongoose";

const router = Router();

router.get("/health", async (_req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? "ok" : "down";

    let redisStatus = "down";
    try {
        const pong = await redisClient.ping();
        redisStatus = pong === "PONG" ? "ok" : "down";
    } catch {
        redisStatus = "down";
    }

    const status = mongoStatus === "ok" && redisStatus === "ok" ? "ok" : "degraded";
    res.status(status === "ok" ? 200 : 503).json({
        status,
        uptime: process.uptime(),
        mongo: mongoStatus,
        redis: redisStatus,
        timestamp: new Date().toISOString()
    });
});

router.use("/", authRoutes);
router.use("/", adminRoutes);

export default router;
