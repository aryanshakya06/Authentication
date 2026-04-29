import axios from "axios";
import { API_URL } from "../config/env.js";

const API_BASE_URL = API_URL;

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return undefined;
};

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const method = (config.method || "get").toLowerCase();
        if (method === "post" || method === "put" || method === "delete" || method === "patch") {
            const csrfToken = getCookie("csrfToken");
            if (csrfToken) {
                config.headers["x-csrf-token"] = csrfToken;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshingAccess = false;
let accessQueue = [];

let isRefreshingCsrf = false;
let csrfQueue = [];

const flushQueue = (queue, error) => {
    queue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    queue.length = 0;
};

const isRefreshAccessUrl = (url = "") => url.includes("/api/v1/refresh") && !url.includes("/api/v1/refresh-csrf");
const isRefreshCsrfUrl = (url = "") => url.includes("/api/v1/refresh-csrf");

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};
        const status = error.response?.status;
        const code = error.response?.data?.code || "";
        const url = originalRequest.url || "";

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // CSRF refresh path: 403 with CSRF_* code
        if (status === 403 && code.startsWith("CSRF_") && !isRefreshCsrfUrl(url)) {
            if (isRefreshingCsrf) {
                return new Promise((resolve, reject) => {
                    csrfQueue.push({ resolve, reject });
                }).then(() => {
                    originalRequest._retry = true;
                    return api(originalRequest);
                });
            }

            isRefreshingCsrf = true;
            try {
                await api.post("/api/v1/refresh-csrf");
                flushQueue(csrfQueue, null);
                originalRequest._retry = true;
                return api(originalRequest);
            } catch (refreshErr) {
                flushQueue(csrfQueue, refreshErr);
                return Promise.reject(refreshErr);
            } finally {
                isRefreshingCsrf = false;
            }
        }

        // Access token refresh path: 401 with ACCESS_TOKEN_EXPIRED
        if (status === 401 && code === "ACCESS_TOKEN_EXPIRED" && !isRefreshAccessUrl(url)) {
            if (isRefreshingAccess) {
                return new Promise((resolve, reject) => {
                    accessQueue.push({ resolve, reject });
                }).then(() => {
                    originalRequest._retry = true;
                    return api(originalRequest);
                });
            }

            isRefreshingAccess = true;
            try {
                await api.post("/api/v1/refresh");
                flushQueue(accessQueue, null);
                originalRequest._retry = true;
                return api(originalRequest);
            } catch (refreshErr) {
                flushQueue(accessQueue, refreshErr);
                return Promise.reject(refreshErr);
            } finally {
                isRefreshingAccess = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
