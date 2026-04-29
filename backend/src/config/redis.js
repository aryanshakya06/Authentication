import { createClient } from "redis";
import { env } from "./env.js";

export const redisClient = createClient({ url: env.redisUrl });

redisClient.on("error", (err) =>
    console.error("Redis client error:", err.message)
);

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis Connected");
    } catch (err) {
        console.error("Redis connection failed:", err.message);
        process.exit(1);
    }
};
