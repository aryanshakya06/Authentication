import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export const ProtectedRoute = ({ children, requireRole }) => {
    const { isAuth, user } = useAuth();
    if (!isAuth) return <Navigate to="/login" replace />;
    if (requireRole && user?.role !== requireRole) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export const PublicOnlyRoute = ({ children }) => {
    const { isAuth } = useAuth();
    if (isAuth) return <Navigate to="/" replace />;
    return children;
};
