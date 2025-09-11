import { Router } from 'express';
import bookingItemController from '../controllers/booking-item.controller';

const router=Router();

router.post('/',bookingItemController.creatBookingItem)

export default router