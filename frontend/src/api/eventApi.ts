import api from "./api";
import type { CreateEventPayload, Event } from "./types/types";


async function createFullEvent(payload: CreateEventPayload): Promise<Event> {
  const res = await api.post("/events", payload);
  return res.data;
}

export {
  createFullEvent
}