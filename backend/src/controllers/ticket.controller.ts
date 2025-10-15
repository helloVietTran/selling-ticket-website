import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

import { AppDataSource } from '../config/data-source';
import { Ticket } from '../models/Ticket.model';
import { TicketType } from '../models/TicketType.model';
import { BaseResponse, StatsTicket } from '../types/response.type';

class TicketController {
  private ticketRepo: Repository<Ticket> = AppDataSource.getRepository(Ticket);
  private ticketTypeRepo: Repository<TicketType> = AppDataSource.getRepository(TicketType);

  getMyTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requester = res.locals.requester;

      const tickets = await this.ticketRepo.find({
        where: {
          ownerId: requester.id
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
        eventEndTime: t.ticketType.event.endTime,
        ticketStatus: t.ticketStatus
      }));

      return res.json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  };

  statsTickets = async (req: Request, res: Response<BaseResponse<StatsTicket>>, next: NextFunction) => {
    try {
      const eventId = parseInt(req.params.eventId);

      const totalSold = await this.ticketRepo.count({
        where: { eventId }
      });

      const totalCheckedIn = await this.ticketRepo.count({
        where: { eventId, checkedIn: true }
      });

      const ticketTypes = await this.ticketTypeRepo.find({
        where: { event: { eventId } },
        relations: ['event']
      });

      const predictTicketSold = ticketTypes.reduce((sum, t) => sum + (t.totalQuantity || 0), 0);

      const percentage = predictTicketSold > 0 ? ((totalSold / predictTicketSold) * 100).toFixed(2) : '0.00';

      return res.status(200).json({
        message: 'Stats successfully',
        data: {
          eventId,
          totalSold,
          totalCheckedIn,
          predictTicketSold,
          percentage
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TicketController();
