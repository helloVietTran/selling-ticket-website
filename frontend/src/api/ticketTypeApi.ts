import api from "./api";
import type { BaseResponse, Booking, SelectTicketTypePayload, StatsTicketType, TicketType }  from '@/types';


async function getTicketTypesByEventId(eventId: string): Promise<BaseResponse<TicketType[]>> {
  const res = await api.get(`/ticket-types/all/events/${eventId}`);

  return res.data;
}

async function bookingTicketType(payload: SelectTicketTypePayload): Promise<BaseResponse<Booking>> {
    const res = await api.post("/ticket-types/booking", payload)
    return res.data;
}

async function statsTicketType(eventId: string | number): Promise<BaseResponse<StatsTicketType[]>> {
  const res = await api.get(`/ticket-types/stats/events/${eventId}`)
  
  return res.data;
}

export {
   getTicketTypesByEventId,
   bookingTicketType,
   statsTicketType
}