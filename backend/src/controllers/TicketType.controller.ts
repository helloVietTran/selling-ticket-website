import { Request, Response, NextFunction } from "express";
import { TicketType } from "../models/TicketType.model";
import { AppDataSource } from "../config/data-source";
import { Ticket } from "../models/Ticket.model";
import ApiResponse from "../utils/ApiResponse"
import { ErrorMap } from "../config/ErrorCode";

class TicketTypeController {
  

  async getTicketType(req: Request, res: Response, next: NextFunction) {
    try {

    const eventRepo = AppDataSource.getRepository(TicketType);
    const ticketRepo=AppDataSource.getRepository(Ticket);
      const event= req.body.event;

      const existedEvent = await eventRepo.findOne({
        where: { event },
      });
       if (!existedEvent) {
        return res.status(404).json(ApiResponse.error(ErrorMap.TICKET_TYPE_NOT_FOUND));
      }
      const ticketId=req.body.ticketId;
      const checkedIn=await ticketRepo.findOne({where:{ticketId}})
      if (!checkedIn) {
        return res.status(404).json(ApiResponse.error(ErrorMap.TICKET_TYPE_NOT_FOUND));
      }
      const totalTicket=await eventRepo.sum("totalQuantity",{totalQuantity: existedEvent.totalQuantity});
      const totalsoldTicket=await eventRepo.sum("totalQuantity",{soldTicket: existedEvent.soldTicket});
      return res.json({
        ticketType: existedEvent.ticketTypeName,
        totalQuantity:existedEvent.totalQuantity,
        soldTicket:existedEvent.soldTicket,
        isChecked_in: checkedIn.checkedIn,
        totalTicket:totalTicket,
        totalsoldTicket:totalsoldTicket
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new TicketTypeController();
