import api from "./api";
import type { Event } from "./types/types";


async function createFullEvent(payload: any): Promise<Event> {
  const res = await api.post("/events", payload);
  return res.data;
}

export {
  createFullEvent
}