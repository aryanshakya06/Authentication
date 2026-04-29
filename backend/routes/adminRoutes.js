import { Router } from 'express';
import { authorizeAdmin, isAuth } from '../middlewares/isAuth.js';
import { adminControlller } from '../controllers/adminController.js';

const router = Router();

router.route("/admin").get(isAuth, authorizeAdmin, adminControlller);

export default router;