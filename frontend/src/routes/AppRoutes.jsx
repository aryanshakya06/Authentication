import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "../components/ProtectedRoute.jsx";
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
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/verify-otp" element={<PublicOnlyRoute><VerifyOTP /></PublicOnlyRoute>} />
        <Route path="/token/:token" element={<PublicOnlyRoute><VerifyEmail /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password/:token" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute requireRole="admin"><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;
