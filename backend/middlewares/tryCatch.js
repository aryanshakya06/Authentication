const tryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (err) {
            let status = err.statusCode || err.status || 500;
            if (err.name === "ValidationError" || err.name === "CastError") {
                status = 400;
            }

            console.error(`[${req.method} ${req.originalUrl}] ${err.name || "Error"}:`, err.message);

            return res.status(status).json({
                success: false,
                message: err.message || "Internal Server Error",
                code: err.code || undefined
            });
        }
    }
}

export default tryCatch;
