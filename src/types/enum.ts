import { boolean } from "zod";

export enum Role {
  Attendee = 'ATTENDEE',
  Organizer = 'ORGANIZER',
  Admin = 'ADMIN'
}

export enum EventStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Ongoing = 'ONGOING',
  Cancelled = 'CANCELLED',
  Ended = 'ENDED'
}

export enum BookingStatus {
  Paid = 'PAID',
  Cancelled = 'CANCELLED',
  Created = 'CREATED'
}

export enum TicketState {
  Sold = 'SOLD',
  Expired = 'EXPIRED',
  Cancelled = 'CANCELLED',
  Available = 'AVAILABLE',
  Held = 'HELD'
}

