import { Router } from 'express';
import multer from 'multer';
import resourceController from '../controllers/resource.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.single('image'), resourceController.uploadImage);

export default router;
