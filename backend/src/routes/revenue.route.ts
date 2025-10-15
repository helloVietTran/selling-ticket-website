import { Router } from 'express';
import revenueController from '../controllers/revenue.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/weekly/events/:eventId', auth, revenueController.getWeeklyRevenue);
router.get('/events/:eventId', auth, revenueController.statsRevenue);

export default router;
