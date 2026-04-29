import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import userRoutes from './routes/user.js'
import { createClient } from 'redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const REQUIRED_ENV = [
    "PORT",
    "MONGODB_URI",
    "REDIS_URL",
    "FRONTEND_URL",
    "SMTP_USER",
    "SMTP_PASS",
    "JWT_SECRET",
    "REFRESH_SECRET"
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    console.error("Copy backend/.env.example to backend/.env and fill in the values.");
    process.exit(1);
}

await connectDB();

export const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) => console.error("Redis client error:", err.message));

await redisClient.connect()
    .then(() => console.log("Redis Connected"))
    .catch((err) => {
        console.error("Redis connection failed:", err.message);
        process.exit(1);
    });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"]
}));

app.use("/api/v1", userRoutes);
app.use("/api/v1", adminRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})
