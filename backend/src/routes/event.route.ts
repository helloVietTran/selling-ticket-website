import { Router } from 'express';

import { validate } from '../middlewares/validate.middleware';
import { createEventSchema } from '../validators/event.validate';

import eventControllers from '../controllers/event.controller';
import ticket_typeController from '../controllers/TicketType.controller';

const router = Router();

router.get('/search', eventControllers.searchEvents);
router.get('/filter', eventControllers.filterEvents);
router.post("/", validate(createEventSchema), eventControllers.createEvent); // giữ đoạn code này
router.get('/', eventControllers.getEvents);
router.put('/:id', eventControllers.updateEvent);
router.delete('/:id', eventControllers.deleteEvent);
router.get('/management',ticket_typeController.getTicketType);


export default router;
