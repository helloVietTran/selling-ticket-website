import { Router } from 'express';
import userController from '../controllers/user.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.put('/my-info', auth, userController.updateMyInfo);
router.get('/my-info', auth, userController.getMyInfo);
router.get('/:id', userController.getUserById);

export default router;
