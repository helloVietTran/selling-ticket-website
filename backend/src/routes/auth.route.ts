import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register',auth, authController.register);
router.post('/login', authController.login);
router.post('/logout',auth, authController.logout);

export default router;
