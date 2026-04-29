// Wrap an async route handler so any thrown/rejected error is forwarded
// to Express' centralized error middleware (see error.middleware.js).
const asyncHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

export default asyncHandler;
