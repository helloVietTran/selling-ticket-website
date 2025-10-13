import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z
    .number()
    .min(1, { message: 'orderId không được để trống' })
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
