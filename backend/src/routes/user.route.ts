import { Router } from 'express';
import userController from '../controllers/user.controller';
import { auth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateUserSchema } from '../validators/user.validate';

const router = Router();

router.put('/my-info', auth, validate(updateUserSchema), userController.updateMyInfo);
router.get('/my-info', auth, userController.getMyInfo);
router.get('/:id', userController.getUserById);

export default router;
