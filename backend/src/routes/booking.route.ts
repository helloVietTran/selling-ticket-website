import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import bookingController from '../controllers/booking.controller';

const router = Router();

router.get('/my-booking', auth, bookingController.getMyBooking);
router.delete('/:bookingId', auth, bookingController.deleteBookingById);

export default router;
