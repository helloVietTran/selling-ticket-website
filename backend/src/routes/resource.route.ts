import { Router } from 'express';
import multer from 'multer';
import resourceController from '../controllers/resource.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), resourceController.uploadImage);

export default router;
