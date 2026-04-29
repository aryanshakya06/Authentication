import mongoose from "mongoose";

import { env, validateEnv } from "./config/env.js";
import connectDB from "./config/db.js";
import { connectRedis, redisClient } from "./config/redis.js";
import app from "./app.js";
import { logger } from "./utils/logger.js";

validateEnv();

await connectDB();
await connectRedis();

const server = app.listen(env.port, () => {
    logger.info(`Server is running on port ${env.port} (${env.nodeEnv})`);
});

const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received - starting graceful shutdown`);

    server.close(() => logger.info("HTTP server closed"));

    try {
        await mongoose.connection.close();
        logger.info("Mongo connection closed");
    } catch (err) {
        logger.error("Error closing mongo:", err.message);
    }

    try {
        await redisClient.quit();
        logger.info("Redis connection closed");
    } catch (err) {
        logger.error("Error closing redis:", err.message);
    }

    process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception:", err);
    process.exit(1);
});
