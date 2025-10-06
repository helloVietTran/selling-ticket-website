import { Request, Response, NextFunction } from 'express';
import { TicketType } from '../models/TicketType.model';
import { AppDataSource } from '../config/data-source';

import { ErrorMap } from '../config/ErrorMap';
import { statsData } from '../types';
import { BaseResponse, statsResponse } from '../types/response.type';
import { SelectTicketInput } from '../validators/ticket.validate';
import { Booking } from '../models/Booking.model';
import { AppError } from '../config/exception';
import { Requester } from '../types';
import { User } from '../models/User.model';
import { BookingStatus } from '../types/enum';
import { BookingItem } from '../models/BookingItem.model';

class TicketTypeController {
  private ticketTypeRepo = AppDataSource.getRepository(TicketType);

  getTicketTypesByEventId = async (req: Request, res: Response<BaseResponse<TicketType[]>>, next: NextFunction) => {
    try {
      const { eventId } = req.params;
      if (!eventId) return AppError.fromErrorCode(ErrorMap.EVENT_NOT_EXISTS);
      const ticketTypes = await this.ticketTypeRepo.findBy({ event: { eventId: Number(eventId) } });
      return res.status(200).json({ message: 'Lấy danh sách thành công', data: ticketTypes });
    } catch (error) {
      next(error);
    }
  };

  bookingTicket = async (
    req: Request<{}, {}, SelectTicketInput>,
    res: Response<BaseResponse<Booking>>,
    next: NextFunction
  ) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const requester = res.locals.requester as Requester;
      const userId = requester.id;
      const { ticketTypes } = req.body;

      if (!ticketTypes || ticketTypes.length === 0) {
        throw AppError.fromErrorCode(ErrorMap.INVALID_REQUEST);
      }
      if (!userId) return 0;
      const user = await queryRunner.manager.findOneBy(User, { id: Number(userId) });
      if (!user) {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      }
      let totalAmount = 0;
      const bookingItems: BookingItem[] = [];
      const now = new Date();
      const ticketTypeEntity = new TicketType();
      for (const item of ticketTypes) {
        const ticketType = await queryRunner.manager.findOneBy(TicketType, { ticketTypeId: Number(item.ticketTypeId) });
        if (!ticketType) {
          throw AppError.fromErrorCode(ErrorMap.TICKET_TYPE_NOT_FOUND);
        }
        await ticketTypeEntity.validate(ticketType, item, now);
        ticketType.soldTicket += item.quantity;
        await queryRunner.manager.save(ticketType);

        totalAmount += Number(ticketType.price) * item.quantity;

        const newBookingItem = new BookingItem();
        newBookingItem.ticketType = ticketType;
        newBookingItem.quantity = item.quantity;
        bookingItems.push(newBookingItem);
      }

      const newBooking = new Booking();
      newBooking.attendee = user;
      newBooking.bookingItems = bookingItems;
      newBooking.amount = totalAmount;
      newBooking.status = BookingStatus.Waiting;
      newBooking.createdAt = new Date();
      newBooking.expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      bookingItems.forEach((item) => (item.booking = newBooking));
      const savedBooking = await queryRunner.manager.save(newBooking);

      savedBooking.bookingItems.forEach((bi) => delete (bi as any).booking);

      await queryRunner.commitTransaction();
      return res.status(201).json({
        message: 'Booking created successfully. Please proceed to payment.',
        data: savedBooking
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      next(error);
    } finally {
      await queryRunner.release();
    }
  };

  statisticalTicketType = async (req: Request, res: Response<statsResponse<any>>, next: NextFunction) => {
    try {
      const eventId= parseInt(req.params.eventId, 10);

      const existedEvent = await this.ticketTypeRepo.findOne({
        where: { event:{eventId }},
        relations: ['event']
      });
      if (!existedEvent) {
        throw AppError.fromErrorCode(ErrorMap.TICKET_TYPE_NOT_FOUND);
      }
      const totalTicket = await this.ticketTypeRepo.sum('totalQuantity', {
        event: { eventId: existedEvent.event.eventId }
      });

      const totalSoldTicket = await this.ticketTypeRepo.sum('soldTicket', {
        event: { eventId: existedEvent.event.eventId }
      });

      const percentage = totalTicket && totalSoldTicket ? (totalSoldTicket / totalTicket) * 100 : 0;
      const statistical:statsData = {
        ticketType: existedEvent.ticketTypeName,
        totalQuantity: existedEvent.totalQuantity,
        soldTicket: existedEvent.soldTicket,
        totalTicket: totalTicket,
        totalsoldTicket: totalSoldTicket,
        percentage: percentage.toFixed(2)
      };
      return res.status(201).json({
        message: 'statistical featch successfully',
        data: statistical
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TicketTypeController();
