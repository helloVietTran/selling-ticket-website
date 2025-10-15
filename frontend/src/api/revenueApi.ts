import type { BaseResponse, PredictRevenue, WeeklyRevenueResponse  } from "@/types";
import api from "./api";



async function statsRevenue(eventId: string): Promise<BaseResponse<PredictRevenue>> {
  const res = await api.get(`/revenue/events/${eventId}`)
  
  return res.data;
}

async function getWeeklyRevenue(eventId: string): Promise<BaseResponse<WeeklyRevenueResponse>> {
  const res = await api.get(`/revenue/weekly/events/${eventId}`)
  
  return res.data;
}



export {
   statsRevenue,
   getWeeklyRevenue
}