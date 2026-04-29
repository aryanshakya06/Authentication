import { logger } from "../utils/logger.js";

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        code: "ROUTE_NOT_FOUND"
    });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
    let status = err.statusCode || err.status || 500;
    if (err.name === "ValidationError" || err.name === "CastError") {
        status = 400;
    }

    logger.error(`${req.method} ${req.originalUrl} ${status} ${err.message}`);

    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
        code: err.code || undefined,
        requestId: req.requestId
    });
};
