import { Router } from 'express';

import { validate } from '../middlewares/validate.middleware';
import { createEventSchema } from '../validators/event.validate';

import EventControllers from '../controllers/event.controller';
import ticket_typeController from '../controllers/TicketType.controller';

const router = Router();

router.get('/search', EventControllers.searchEvents);
router.get('/filter', EventControllers.filterEvents);
router.post("/", validate(createEventSchema), EventControllers.createEvent); // giữ đoạn code này
router.get('/', EventControllers.getEvents);
router.put('/:id', EventControllers.updateEvent);
router.delete('/:id', EventControllers.deleteEvent);
router.get('/management',ticket_typeController.getTicketType);


export default router;
