export type RegisterPayload = {
  email: string;
  password: string;
  userName: string;
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
};

export type SelectTicketTypePayload = {
   ticketTypes: {
    ticketTypeId: string;
    quantity: number;
  }[];
}

