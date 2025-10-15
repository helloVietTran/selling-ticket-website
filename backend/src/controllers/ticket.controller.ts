import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

import { AppDataSource } from '../config/data-source';
import { Ticket } from '../models/Ticket.model';
import { TicketType } from '../models/TicketType.model';
import { BaseResponse, StatsTicket, UserOutput } from '../types/response.type';
import { CheckinInput } from '../validators/ticket.validate';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { Event } from '../models/Event.model';
import { EventStatus } from '../types/enum';
import { User } from '../models/User.model';

class TicketController {
  private ticketRepo: Repository<Ticket> = AppDataSource.getRepository(Ticket);
  private ticketTypeRepo: Repository<TicketType> = AppDataSource.getRepository(TicketType);
  private eventRepo: Repository<Event> = AppDataSource.getRepository(Event);
  private userRepo: Repository<User> = AppDataSource.getRepository(User);

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

  checkin = async (req: Request<{}, {}, CheckinInput>, res: Response<BaseResponse<UserOutput>>, next: NextFunction) => {
    try {
      const { eventId, ticketId, userId, code } = req.body;

      // Lấy vé từ DB
      const ticket = await this.ticketRepo.findOne({
        where: { eventId, ticketId, ownerId: userId },
        relations: ['qrCode']
      });

      const event = await this.eventRepo.findOne({
        where: { eventId }
      });

      if (!event || event.status != EventStatus.Ongoing) {
        throw AppError.fromErrorCode(ErrorMap.EVENT_NOT_FOUND);
      }

      if (!ticket) {
        throw AppError.fromErrorCode(ErrorMap.TICKET_NOT_FOUND);
      }

      const user = await this.userRepo.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      }

      // Check QR
      if (ticket.qrCode?.randomCode !== code) {
        throw AppError.fromErrorCode(ErrorMap.INVALID_QR_CODE);
      }

      // vé đã dùng chưa
      if (ticket.checkedIn) {
        throw AppError.fromErrorCode(ErrorMap.TICKET_ALREADY_CHECKED_IN);
      }

      // Cập nhật trạng thái check-in
      ticket.checkedIn = true;
      await this.ticketRepo.save(ticket);

      return res.json({
        message: 'Check-in thành công',
        data: {
          id: user.id,
          email: user.email,
          userName: user.userName,
          roles: user.roles
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TicketController();
