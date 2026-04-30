import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "../components/ProtectedRoute.jsx";
import Landing from "../pages/Landing.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import VerifyOTP from "../pages/VerifyOTP.jsx";
import VerifyEmail from "../pages/Verify.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import NotFound from "../pages/NotFound.jsx";

const AppRoutes = () => (
    <Routes>
        {/* Public landing - shown to everyone, with auth-aware CTAs */}
        <Route path="/" element={<Landing />} />

        {/* Authenticated dashboard */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        {/* Public-only auth pages */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/verify-otp" element={<PublicOnlyRoute><VerifyOTP /></PublicOnlyRoute>} />
        <Route path="/token/:token" element={<PublicOnlyRoute><VerifyEmail /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password/:token" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />

        {/* Admin-gated */}
        <Route path="/dashboard" element={<ProtectedRoute requireRole="admin"><Dashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;
