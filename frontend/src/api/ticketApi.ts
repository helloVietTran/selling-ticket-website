import type { BaseResponse, CheckinPayload, StatsTicket, TicketResponse, User } from "@/types";
import api from "./api";

async function getMyTickets(): Promise<BaseResponse<TicketResponse[]>> {
  const res = await api.get('/tickets/my')
  
  return res.data;
}

async function statsTickets(eventId: string): Promise<BaseResponse<StatsTicket>> {
  const res = await api.get(`/tickets/events/${eventId}`)
  
  return res.data;
}


async function checkin(payload: CheckinPayload): Promise<BaseResponse<User>> {
  const res = await api.post('/tickets/checkin', payload)
  
  return res.data;
}



export {
   getMyTickets,
   statsTickets,
   checkin
}