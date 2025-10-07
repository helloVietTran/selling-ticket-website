import api from "./api";
import type { CreateEventPayload, GetEventsParams }  from '@/types';
import type { BaseResponse, Event }  from '@/types';

async function createFullEvent(payload: CreateEventPayload): Promise<BaseResponse<Event>> {
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

async function getMyEvents(eventId: string, organizerId: string): Promise<BaseResponse<Event[]>>{
  const res =  await api.delete(`/events/${eventId}/organizer/${organizerId}`);

  return res.data;
}

async function getEventById(id: string | number): Promise<BaseResponse<Event>> {
  const res =  await api.get(`/events/${id}`);

  return res.data;
}

export {
  createFullEvent, 
  getEvents,
  deleteEvent,
  getMyEvents,
  getEventById
}
