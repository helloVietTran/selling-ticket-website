import api from "./api";
import type { BaseResponse, Booking } from '@/types';

async function getMyBooking(): Promise<BaseResponse<Booking>> {
  const res = await api.get("/booking/my-booking");
  return res.data;
}


async function deleteMyBookingById(bookingId: string | number): Promise<BaseResponse<Booking>> {
  const res = await api.delete(`/booking/${bookingId}`);
  return res.data;
}

export {
  getMyBooking, 
  deleteMyBookingById
}
