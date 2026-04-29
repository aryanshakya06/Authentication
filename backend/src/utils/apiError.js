export class ApiError extends Error {
    constructor(statusCode, message, code) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        if (code) this.code = code;
    }

    static badRequest(message, code) { return new ApiError(400, message, code); }
    static unauthorized(message, code) { return new ApiError(401, message, code); }
    static forbidden(message, code) { return new ApiError(403, message, code); }
    static notFound(message, code) { return new ApiError(404, message, code); }
    static conflict(message, code) { return new ApiError(409, message, code); }
    static tooMany(message, code) { return new ApiError(429, message, code); }
    static internal(message, code) { return new ApiError(500, message, code); }
}
