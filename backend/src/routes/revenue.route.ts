import  { Router } from 'express';
import RevenueController from '../controllers/revenue.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/revenue',auth, RevenueController.getMyRevenue);

export default router;