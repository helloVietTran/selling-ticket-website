import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { Repository } from 'typeorm';

import { AppDataSource } from '../config/data-source';
import { Booking } from '../models/Booking.model';
import { Ticket } from '../models/Ticket.model';
import { QrCode } from '../models/QrCode.model';
import { User } from '../models/User.model';
import { TicketState } from '../types/enum';

class TicketController {
  private ticketRepo: Repository<Ticket> = AppDataSource.getRepository(Ticket);

  generateTickets = async (booking: Booking, user: User, eventId: number) => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ticketsResponse: any[] = [];

      for (const item of booking.bookingItems) {
        for (let i = 0; i < item.quantity; i++) {
          // create ticket
          const ticket = queryRunner.manager.create(Ticket, {
            ticketType: item.ticketType,
            ownerId: user.id,
            eventId: eventId,
            checkedIn: false,
            seatNumber: 1,
            ticketStatus: TicketState.Available
          });
          await queryRunner.manager.save(ticket);

          // create QR Code
          const randomCode = uuidv4();
          const issuedAt = new Date();
          const expiresAt = undefined;

          const qrEntity = queryRunner.manager.create(QrCode, {
            ticket,
            issuedAt,
            expiresAt,
            randomCode
          });
          await queryRunner.manager.save(qrEntity);

          // Generate QR Image
          const payload = { issuedAt, expiresAt, randomCode };
          await QRCode.toDataURL(JSON.stringify(payload));
        }
      }

      await queryRunner.commitTransaction();

      return ticketsResponse;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };

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
