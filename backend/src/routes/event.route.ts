import { Router } from 'express';

import { validate } from '../middlewares/validate.middleware';
import { auth } from '../middlewares/auth.middleware';

import { createEventSchema } from '../validators/event.validate';

import eventController from '../controllers/event.controller';

const router = Router();

router.post('/', auth, validate(createEventSchema), eventController.createEvent.bind(eventController));
router.get('/', eventController.getEvents);
router.get('/search', eventController.searchEvents);
router.get('/filter', eventController.filterEvents);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;
