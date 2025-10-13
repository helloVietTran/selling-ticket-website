import { Router } from 'express';
import ticketTypeController from '../controllers/ticket-type.controller';

import { auth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { selectTicketSchema } from '../validators/ticket.validate';

const router = Router();

router.post('/booking', auth, validate(selectTicketSchema), ticketTypeController.bookingTicketType);
router.get('/stats', auth, ticketTypeController.statisticalTicketType);
router.get('/all/events/:eventId', ticketTypeController.getTicketTypesByEventId);

export default router;
