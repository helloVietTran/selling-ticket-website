export enum Role {
  User = 'USER',
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

export interface Requester {
  id: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
