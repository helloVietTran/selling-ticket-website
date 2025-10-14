import type { BaseResponse, TicketResponse } from "@/types";
import api from "./api";

async function getMyTickets(): Promise<BaseResponse<TicketResponse[]>> {
  const res = await api.get('/tickets/my')
  
  return res.data;
}

export {
   getMyTickets
}