// src/routes/user.route.ts
import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);

export default router;
