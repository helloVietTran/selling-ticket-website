import api from "./api";
import type { BaseResponse, Booking } from '@/types';

async function getMyBooking(): Promise<BaseResponse<Booking>> {
  const res = await api.get("/my-booking");
  return res.data;
}

export {
  getMyBooking, 

}
