import api from "./api";
import type { GetEventsParams } from "./types/params.type";
import type { BaseResponse, Event } from "./types/response.type";

async function createFullEvent(payload: any): Promise<BaseResponse<Event>> {
  const res = await api.post("/events", payload);
  return res.data;
}

async function getEvents(params: GetEventsParams): Promise<BaseResponse<Event[]>> {
  const res = await api.get("/events", {
    params: {
      startTime: params.startTime,
      endTime: params.endTime,
      category: params.category,
      province: params.province,
      keyword: params.keyword
    },
  });

  return res.data;
}

async function deleteEvent(eventId: string): Promise<void>{
  await api.delete(`/events/${eventId}`);
}

export {
  createFullEvent, 
  getEvents,
  deleteEvent
}
