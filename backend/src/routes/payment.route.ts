import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import paymentController from '../controllers/payment.controller';
import { validate } from '../middlewares/validate.middleware';
import { createPaymentSchema } from '../validators/payment.validate';

const router = Router();

router.post('/', auth, validate(createPaymentSchema), paymentController.createPaymentUrl);
router.post('/query-transaction', paymentController.querydr);

export default router;