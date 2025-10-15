import type { EventStatus } from "@/constant";

// params
export type GetEventsParams = {
  startTime?: string;
  endTime?: string;
  category?: string;
  province?: string;
  keyword?: string;
};

export type GetMyEventParams = {
  status?: string;
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
    eventImage: string;
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

export type TokenPayload = {
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
  eventId: string | number
};

export interface CreatePaymentPayload {
  orderId: string | number;
  eventId: string | number;
}

// dùng chung
export interface BaseResponse<T> {
  message: string;
  status?: string;
  data?: T;
}


export type PaginateResponse<T> = {
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export type Image = {
  url: string;
  id: string;
  createdAt: Date
}

export type Organizer = {
  organizerId: number;
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
  status: EventStatus;

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
  createdAt: Date;
  expiresAt: Date;
  amount: number;
  attendee: User;
  bookingItems: BookingItem[];

}

export interface BookingItem {
  quantity: number;
  ticketType: TicketType;
}

export interface StatsTicketType {
  ticketTypeName: string;
  totalQuantity: number;
  soldTicket: number;
  percentage: string | number;
  totalTicket: number;
  totalSoldTicket: number;
  overallPercentage?: string | number;
}

export interface StatsTicket{
  eventId: number;
  totalSold: number;
  totalCheckedIn: number;
  percentage: number | string;
  predictTicketSold: number;
}

export interface TicketResponse {
  ticketId: number;
  ticketType: string;
  checkedIn: boolean;
  seatNumber?: number;
  eventName: string;
  eventStartTime: string;
  eventEndTime: string;
  ticketStatus: 'EXPIRED' | 'AVAILABLE' | "CANCELED"
}

export interface PredictRevenue {
  predictRevenue: number;
  realityRevenue: number;
  percentage: number | string;
}


export interface WeeklyRevenueResponse {
  eventId: number;
  totalRevenue: number;
  totalTicketsSold: number;
  dailyRevenue: {
    date: string;
    revenue: number;
    ticketsSold: number;
  }[];
}

export interface CheckinPayload {
  eventId: number;
  ticketId: number;
  userId: number;
  code: string;
}