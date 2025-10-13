import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.put('/accept/:eventId', auth, adminController.acceptEvent);

export default router;
