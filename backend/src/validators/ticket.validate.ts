import { z } from 'zod';

export const selectTicketSchema = z.object({
  ticketTypes: z.array(
    z.object({
      ticketTypeId: z.string().min(1, 'ticketTypeId is required'),
      quantity: z.number().min(1, 'quantity must be at least 1')
    })
  ),
  eventId: z.string().nonoptional('EventId is required')
});

export const checkinSchema = z.object({
  eventId: z.number().nonoptional(),
  ticketId: z.number().nonoptional(),
  userId: z.number().nonoptional(),
  code: z.string().nonoptional()
});

export type SelectTicketInput = z.infer<typeof selectTicketSchema>;
export type CheckinInput = z.infer<typeof checkinSchema>;
