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
  Waiting = 'Wait',
  Expired = 'EXPIRED'
}

export enum TicketState {
  Sold = 'SOLD',
  Expired = 'EXPIRED',
  Cancelled = 'CANCELLED',
  Available = 'AVAILABLE',
  Held = 'HELD'
}

export enum Category {
  Music = 'Âm nhạc',
  Other = 'Khác',
  Sport = 'Thể thao',
  Art = 'Nghệ thuật'
}
