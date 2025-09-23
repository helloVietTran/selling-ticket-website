 import { Router } from 'express';
 import emailController from "../controllers/email.controller";

const router = Router();

router.post('/', emailController.sendEmailQR);

export default router;

