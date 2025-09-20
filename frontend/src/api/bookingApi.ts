import api from "./api";
import type { BaseResponse, BookingResponse } from "./types/response.type";

async function getMyBooking(): Promise<BaseResponse<BookingResponse>> {
  const res = await api.get("/my-booking");
  return res.data;
}

export {
  getMyBooking, 

}
