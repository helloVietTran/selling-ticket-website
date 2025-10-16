import { Category, EventStatus } from './enum';

export interface DeleteEventParams {
  eventId: string;
  organizerId: string;
}

export interface EventQueries {
  startTime: string;
  endTime: string;
  category: Category;
  province: string;
  keyword: string;

  page?: string;
  limit?: string;

  status?: EventStatus;
}
