// src/routes/user.route.ts
import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);

export default router;
