import { Router } from 'express';
import ticketController from '../controllers/ticket.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/my', auth, ticketController.getMyTickets);

export default router;
