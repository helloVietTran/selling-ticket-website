import { Router } from 'express';
import EventControllers from '../controllers/event.controller';
import ticket_typeController from '../controllers/TicketType.controller';

const router = Router();

router.get('/search', EventControllers.searchEvents);
router.post('/', EventControllers.createEvent);
router.get('/', EventControllers.getEvents);
router.put('/:id', EventControllers.update);
router.delete('/:id', EventControllers.delete);
router.get('/management',ticket_typeController.getTicketType);
router.put('/:id', EventControllers.updateEvent);
router.delete('/:id', EventControllers.deleteEvent);


export default router;
