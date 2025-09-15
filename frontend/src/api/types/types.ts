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
  title: string | undefined;
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

export type CreateEventPayload = {
  organizer: Organizer | undefined;
  venue: Venue | undefined;
  event: Event | undefined;
  tickeTypes: TicketType[] | undefined;
  setting: Setting | undefined;
  paymentInfo: PaymentInfo | undefined;
};
