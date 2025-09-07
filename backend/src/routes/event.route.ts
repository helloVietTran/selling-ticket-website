import { Router } from 'express';
import EventControllers from '../controllers/event.controller';

const router = Router();

router.get('/search', EventControllers.searchEvents);
router.get('/filter', EventControllers.filterEvents);
router.post('/', EventControllers.createEvent);
router.get('/', EventControllers.getEvents);
router.put('/:id', EventControllers.updateEvent);
router.delete('/:id', EventControllers.deleteEvent);

export default router;
