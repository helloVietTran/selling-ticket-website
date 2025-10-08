import type { PaginateResponse } from "@/components/event-list";
import api from "./api";
import type { CreateEventPayload, GetEventsParams, GetMyEventParams }  from '@/types';
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

async function deleteEvent(eventId: string | number, organizerId: string): Promise<void>{
  await api.delete(`/events/${eventId}/organizer/${organizerId}`); 
}

async function getMyEvents(organizerId: string, params: GetMyEventParams): Promise<PaginateResponse<Event>>{
  const res =  await api.get(`/events/organizer/${organizerId}`,  { params: {
    status: params.status,
    keyword: params.keyword
  }});

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
