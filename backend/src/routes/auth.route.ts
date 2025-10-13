import { Router } from 'express';

import authController from '../controllers/auth.controller';
import { loginSchema, logoutSchema, registerSchema } from '../validators/auth.validate';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', validate(logoutSchema), authController.logout);
router.post('/verify-token', authController.verifyToken);

export default router;
