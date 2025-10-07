import { Router } from 'express';
import multer from 'multer';
import ResourceController from '../controllers/resource.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), ResourceController.uploadImage);

export default router;
