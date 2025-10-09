import { Router } from 'express';
import organizerController from '../controllers/organizer.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/my', auth, organizerController.getMyOrganizerRecord);


export default router;
