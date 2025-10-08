import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema } from '../validators/auth.validate';

const router = Router();

router.post('/register',validate(registerSchema), authController.register);
router.post('/login',validate(registerSchema),authController.login);
router.post('/logout', authController.logout);
router.post('/verify-token', authController.verifyToken);

export default router;
