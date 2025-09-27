import { Router } from 'express';
import ticketTypeController from '../controllers/ticket-type.controller';

import { auth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { selectTicketSchema } from '../validators/ticket.validate';

const router = Router();

router.get('/all/events/:eventId', ticketTypeController.getTicketTypesByEventId);
router.post('/select-ticket-type', auth, validate(selectTicketSchema), ticketTypeController.bookingTicket);

export default router;
