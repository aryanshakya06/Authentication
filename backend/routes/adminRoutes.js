import { Router } from 'express';
import { authorizeAdmin, isAuth } from '../middlewares/isAuth.js';
import { adminController } from '../controllers/adminController.js';

const router = Router();

router.route("/admin").get(isAuth, authorizeAdmin, adminController);

export default router;