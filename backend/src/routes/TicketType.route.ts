import { Router } from 'express';
import ticket_typeController from '../controllers/ticketType.controller';

const router = Router();

router.post('/', ticket_typeController.createTicketType);
router.get('/', ticket_typeController.readTicketType);
router.put('/:id', ticket_typeController.updateTicketType);
router.delete('/:id', ticket_typeController.deleteTicketType);

export default router;
