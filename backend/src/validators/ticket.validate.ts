import { z } from 'zod';

export const selectTicketSchema = z.object({
  ticketTypes: z.array(
    z.object({
      ticketTypeId: z.string().min(1, 'ticketTypeId is required'),
      quantity: z.number().min(1, 'quantity must be at least 1')
    })
  )
});

export type SelectTicketInput = z.infer<typeof selectTicketSchema>;
