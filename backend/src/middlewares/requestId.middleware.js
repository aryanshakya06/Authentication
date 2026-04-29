import crypto from "crypto";

export const requestId = (req, res, next) => {
    const incoming = req.headers["x-request-id"];
    const id = typeof incoming === "string" && incoming.length > 0
        ? incoming
        : crypto.randomUUID();
    req.requestId = id;
    res.setHeader("X-Request-Id", id);
    next();
};
