import { Router } from 'express';
import ticketTypeController from "../controllers/TicketType.controller"

const router = Router();

router.post('/', ticketTypeController.createTicketType);
router.get('/', ticketTypeController.readTicketType);
router.put('/:id', ticketTypeController.updateTicketType);
router.delete('/:id', ticketTypeController.deleteTicketType);


export default router;