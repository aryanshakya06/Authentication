import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { requestId } from "./middlewares/requestId.middleware.js";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

// Render (and most PaaS) put the app behind a single proxy. trust proxy = 1
// makes Express read the real client IP from X-Forwarded-For so rate limiters
// and req.ip work correctly. Override via TRUST_PROXY if you sit behind a
// different number of proxies.
app.set("trust proxy", env.trustProxy);

app.disable("x-powered-by");

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// CORS allowlist. Accepts a single origin or a comma-separated list via
// FRONTEND_URL, so preview deployments can be whitelisted alongside the
// canonical origin without code changes.
app.use(
    cors({
        origin: (origin, cb) => {
            // Allow same-origin and tools like curl/server-to-server (no Origin header).
            if (!origin) return cb(null, true);
            if (env.frontendOrigins.includes(origin)) return cb(null, true);
            return cb(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"]
    })
);

app.use(requestId);

// Request logging. 'dev' in development for human-readable colored output.
// 'combined' in production for an Apache-style log line that hosting
// platforms parse cleanly.
app.use(morgan(env.isProd ? "combined" : "dev"));

app.use(globalLimiter);

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
