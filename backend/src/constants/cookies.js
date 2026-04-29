import { env } from "../config/env.js";

const baseCookieOptions = () => ({
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax"
});

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";
export const CSRF_COOKIE = "csrfToken";

export const ACCESS_TTL_MS = 15 * 60 * 1000;
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const CSRF_TTL_MS = 60 * 60 * 1000;

export const ACCESS_TTL_SEC = ACCESS_TTL_MS / 1000;
export const REFRESH_TTL_SEC = REFRESH_TTL_MS / 1000;
export const CSRF_TTL_SEC = CSRF_TTL_MS / 1000;

export const accessCookieOptions = () => ({
    ...baseCookieOptions(),
    maxAge: ACCESS_TTL_MS
});

export const refreshCookieOptions = () => ({
    ...baseCookieOptions(),
    maxAge: REFRESH_TTL_MS
});

export const csrfCookieOptions = () => ({
    ...baseCookieOptions(),
    httpOnly: false,
    maxAge: CSRF_TTL_MS
});

export const clearCookieOptions = () => ({
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax"
});
