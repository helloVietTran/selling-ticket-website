import  { Router } from 'express';
import RevenueController from '../controllers/revenue.controller';

const router = Router();

router.get('/revenue',  RevenueController.getRevenue);

export default router;