import { NextFunction, Request, Response } from 'express';

import { Repository } from 'typeorm';

import { AppDataSource } from '../config/data-source';
import { Ticket } from '../models/Ticket.model';
import { TicketState } from '../types/enum';

class TicketController {
  private ticketRepo: Repository<Ticket> = AppDataSource.getRepository(Ticket);

  getMyTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requester = res.locals.requester;

      const tickets = await this.ticketRepo.find({
        where: {
          ownerId: requester.id,
          ticketStatus: TicketState.Available
        },
        relations: ['ticketType', 'ticketType.event']
      });

      const responseData = tickets.map((t) => ({
        ticketId: t.ticketId,
        ticketType: t.ticketType.ticketTypeName,
        checkedIn: t.checkedIn,
        seatNumber: t.seatNumber,
        eventName: t.ticketType.event.title,
        eventStartTime: t.ticketType.event.startTime,
        eventEndTime: t.ticketType.event.endTime
      }));

      return res.json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TicketController();
