import { Router } from 'express';
import ticketController from '../controllers/ticket.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/my', auth, ticketController.getMyTickets);
router.get('/events/:eventId', ticketController.statsTickets);

export default router;
