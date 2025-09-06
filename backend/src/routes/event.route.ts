import { Router } from 'express';
import EventControllers from '../controllers/event.controller';
import ticket_typeController from '../controllers/TicketType.controller';

const router = Router();

router.post('/', EventControllers.create);
router.get('/', EventControllers.getEvents);
router.put('/:id', EventControllers.update);
router.delete('/:id', EventControllers.delete);
router.get('/management',ticket_typeController.getTicketType);
export default router;
