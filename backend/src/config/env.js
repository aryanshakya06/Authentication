import dotenv from "dotenv";

dotenv.config();

const REQUIRED = [
    "PORT",
    "MONGODB_URI",
    "REDIS_URL",
    "FRONTEND_URL",
    "SMTP_USER",
    "SMTP_PASS",
    "JWT_SECRET",
    "REFRESH_SECRET"
];

export const validateEnv = () => {
    const missing = REQUIRED.filter((key) => !process.env[key]);
    if (missing.length) {
        console.error(`Missing required environment variables: ${missing.join(", ")}`);
        console.error("Copy backend/.env.example to backend/.env and fill in the values.");
        process.exit(1);
    }
};

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    isProd: process.env.NODE_ENV === "production",
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGODB_URI,
    redisUrl: process.env.REDIS_URL,
    frontendUrl: process.env.FRONTEND_URL,
    smtp: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    jwt: {
        accessSecret: process.env.JWT_SECRET,
        refreshSecret: process.env.REFRESH_SECRET
    },
    appName: process.env.APP_NAME || "Authly"
};
