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

app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: env.frontendUrl,
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"]
    })
);
app.use(requestId);

if (!env.isProd) {
    app.use(morgan("dev"));
}

app.use(globalLimiter);

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
