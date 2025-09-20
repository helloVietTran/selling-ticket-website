import { RequestHandler, Router } from 'express';

import { validate } from '../middlewares/validate.middleware';
import { auth } from '../middlewares/auth.middleware';

import { createEventSchema } from '../validators/event.validate';

import eventController from '../controllers/event.controller';

const router = Router();

router.post('/', auth, validate(createEventSchema), eventController.createEvent.bind(eventController));
router.get('/filter', eventController.filterEvents);
router.delete('/:id/organizer/:organizerId', auth, eventController.deleteEvent);
router.get('/organizer/:organizerId', auth, eventController.getEventsByOrganizer )

export default router;
