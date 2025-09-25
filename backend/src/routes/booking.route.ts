import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import bookingController from '../controllers/booking.controller';

const router = Router();

router.get('/my-booking', auth, bookingController.getMyBooking);

export default router;
