import { Router } from 'express';
import EventControllers from '../controllers/event.controller';

const router = Router();

router.post('/', EventControllers.create);
router.get('/', EventControllers.getEvents);
router.put('/:id', EventControllers.update);
router.delete('/:id', EventControllers.delete);

export default router;
