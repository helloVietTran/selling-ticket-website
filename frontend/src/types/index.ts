// params
export type GetEventsParams = {
  startTime?: string;
  endTime?: string;
  category?: string;
  province?: string;
  keyword?: string;
};

// request
export interface CreateEventPayload {
  organizer: {
    organizerName: string;
    organizerInfo: string;
  };
  venue: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  event: {
    title: string;
    category: string;
    eventInfo: string;
    startTime: string;
    endTime: string;
    eventImage?: Record<string, any>;
    organizer?: {
      organizerName: string;
      organizerInfo: string;
    };
    venue?: {
      province: string;
      district: string;
      ward: string;
      street: string;
    };
  };
  ticketTypes: {
    name: string;
    price: string;
    quantity: string;
    description?: string;
    maxPerUser: string;
    minPerUser: string;
    startSellDate: string;
    endSellDate: string;
  }[];
  setting: {
    messageToReceiver?: string;
  };
  paymentInfo: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    branch: string;
    organizerId?: string;
    organizationName?: string;
    organizerInfo?: string;
  };
}

export type RegisterPayload = {
  email: string;
  password: string;
  userName: string;
  confirmPassword: string;
};

export type LoginPayLoad = {
  email: string;
  password: string;
};

export type LogoutPayload = {
  accessToken: string;
};

export type UpdateUserPayload = {
  email: string;
  phoneNumber: string;
  userName: string;
  dob: string;
  avatarFile?: File | null;
};

export type SelectTicketTypePayload = {
  ticketTypes: {
    ticketTypeId: string;
    quantity: number;
  }[];
};

// dùng chung
export interface BaseResponse<T> {
  message: string;
  status?: string;
  data?: T;
}

export type Organizer = {
  organizerName: string;
  organizerInfo: string;
};

export type Venue = {
  province: string;
  district: string;
  ward: string;
  street: string;
};

export type TicketType = {
  ticketTypeId: number;
  ticketTypeName: string;
  description?: string;
  price: number;
  totalQuantity: number;
  soldTicket: number;
  minPerUser: number;
  maxPerUser: number;
  startSellDate: string;
  endSellDate: string;
};

export type Event = {
  eventId: number;
  title: string;
  category: string;
  eventInfo: string;
  startTime: string;
  endTime: string;
  eventImage: string;

  ticketTypes: TicketType[];
  minPriceTicketType: number;
  organizer: Organizer;
  venue: Venue;
};

export type Setting = {
  messageToReceiver?: string;
};

export type PaymentInfo = {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  branch: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export interface User {
  id: number;
  email: string;
  userName: string;
  phoneNumber: string;
  roles: string;
  dob: string;
  avatar: string;
}

export interface Booking {
  bookingId: number;
  status: string;
  createdAt?: Date;
  expiresAt?: Date;
}

export interface StatsTicketType {
  type: string;
  price: number;
  checkedIn: number;
  sold: number;
  total: number;
}
