import { Router } from "express";
import { authorizeAdmin, isAuth } from "../middlewares/auth.middleware.js";
import { adminController } from "../controllers/admin.controller.js";

const router = Router();

router.get("/admin", isAuth, authorizeAdmin, adminController);

export default router;
