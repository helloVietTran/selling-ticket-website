import type { BaseResponse, CreatePaymentPayload } from "@/types";
import api from "./api";

async function payBooking(payload: CreatePaymentPayload): Promise<BaseResponse<{url: string}>> {

  const res = await api.post("/payment", payload);

  return res.data;
}
export {
    payBooking
}