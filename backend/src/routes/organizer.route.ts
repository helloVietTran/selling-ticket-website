import { Router } from 'express';
import organizerController from '../controllers/organizer.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', auth, organizerController.createOrganizer);
router.get('/:organizerId', auth, organizerController.getOneOrganizer);
router.put('/:organizerId', auth, organizerController.updateOrganizer);

export default router;
