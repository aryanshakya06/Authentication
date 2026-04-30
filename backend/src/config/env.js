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
    if (process.env.JWT_SECRET && process.env.JWT_SECRET === process.env.REFRESH_SECRET) {
        console.error("JWT_SECRET and REFRESH_SECRET must be different. Run `npm run gen-secrets`.");
        process.exit(1);
    }
};

const splitOrigins = (raw) =>
    raw
        .split(",")
        .map((s) => s.trim().replace(/\/+$/, ""))
        .filter(Boolean);

const frontendOrigins = splitOrigins(process.env.FRONTEND_URL || "");

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    isProd: process.env.NODE_ENV === "production",
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGODB_URI,
    redisUrl: process.env.REDIS_URL,
    // Primary frontend origin (first entry). Used as the base for verify and reset email links.
    frontendUrl: frontendOrigins[0] || "",
    // Full list of allowed origins for CORS. Lets you whitelist preview deployments alongside prod.
    frontendOrigins,
    // Optional cookie domain for cross-subdomain prod (e.g. ".example.com" so cookies set on
    // api.example.com are sent on requests from app.example.com). Leave empty to scope cookies
    // to the API origin only, which is the default and works for most setups.
    cookieDomain: process.env.COOKIE_DOMAIN || undefined,
    smtp: {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE
            ? process.env.SMTP_SECURE === "true"
            : (Number(process.env.SMTP_PORT) || 465) === 465,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM || process.env.SMTP_USER
    },
    jwt: {
        accessSecret: process.env.JWT_SECRET,
        refreshSecret: process.env.REFRESH_SECRET
    },
    appName: process.env.APP_NAME || "Authly",
    trustProxy: Number(process.env.TRUST_PROXY ?? 1)
};
