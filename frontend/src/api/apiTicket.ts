import api from "./api";




export type SelectTicketTypePayload = {
   ticketTypes: {
    ticketTypeId: string;
    quantity: number;
  }[];
}


async function getTicketTypesByEventId(eventId: string) {
  const res = await api.get(`/ticket-types/all/events/${eventId}`);

  return res.data;
}

async function selectTicket(payload: SelectTicketTypePayload){
    const res = await api.post("/select-ticket-type", payload)
    return res.data;
}

export {
   getTicketTypesByEventId,
   selectTicket
}