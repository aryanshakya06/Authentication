import { Router } from "express";
import {
    loginUser,
    logoutUser,
    myProfile,
    refreshAccessToken,
    refreshCSRF,
    registerUser,
    resendOtp,
    resendVerification,
    verifyOtp,
    verifyUser,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { verifyCSRFToken } from "../middlewares/csrf.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authLimiter, registerUser);
router.post("/verify/:token", verifyUser);
router.post("/resend-verification", authLimiter, resendVerification);

router.post("/login", authLimiter, loginUser);
router.post("/verify", verifyOtp);
router.post("/resend-otp", authLimiter, resendOtp);

router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/me", isAuth, myProfile);
router.post("/refresh", refreshAccessToken);
router.post("/logout", isAuth, verifyCSRFToken, logoutUser);
router.post("/refresh-csrf", isAuth, refreshCSRF);

export default router;
