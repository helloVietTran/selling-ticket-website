import { Router } from 'express';
import ticketController from '../controllers/ticket.controller';
import { auth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { checkinSchema } from '../validators/ticket.validate';

const router = Router();

router.get('/my', auth, ticketController.getMyTickets);
router.post('/checkin', auth, validate(checkinSchema), ticketController.checkin);
router.get('/events/:eventId', ticketController.statsTickets);

export default router;
