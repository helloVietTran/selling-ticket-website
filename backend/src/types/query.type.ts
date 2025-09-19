import { Category, EventStatus } from './enum';

export interface DeleteEventParams {
  eventId: string;
  organizerId: string;
}

export interface EventQueries {
  startTime: Date;
  endTime: Date;
  category: Category;
  district: string;
  keyword: string;

  page?: string;
  limit?: string;

  status?: EventStatus;
}
