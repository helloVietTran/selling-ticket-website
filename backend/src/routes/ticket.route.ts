import { Router } from 'express';
import ticketController from '../controllers/ticket.controller';

const router = Router();

router.post('/generate', ticketController.generateTickets);

export default router;
