export interface BaseResponse<T>{
    message: string;
    status?: string;
    data?: T
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
  name: string;
  price: string;
  quantity: string;
  description?: string;
  maxPerUser: string;
  minPerUser: string;
  startSellDate: string;
  endSellDate: string;
};

export type Event = {
  title: string;
  category: string;
  eventInfo: string;
  startTime: string;
  endTime: string;
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

