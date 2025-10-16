import { Request, Response, NextFunction } from 'express';
import { TicketType } from '../models/TicketType.model';
import { AppDataSource } from '../config/data-source';

import { ErrorMap } from '../config/ErrorMap';
import { BaseResponse, StatsTicketType } from '../types/response.type';
import { SelectTicketInput } from '../validators/ticket.validate';
import { Booking } from '../models/Booking.model';
import { AppError } from '../config/exception';
import { Requester } from '../types';
import { User } from '../models/User.model';
import { BookingStatus } from '../types/enum';
import { BookingItem } from '../models/BookingItem.model';
import { LessThan } from 'typeorm';

class TicketTypeController {
  private ticketTypeRepo = AppDataSource.getRepository(TicketType);

  getTicketTypesByEventId = async (req: Request, res: Response<BaseResponse<TicketType[]>>, next: NextFunction) => {
    try {
      const { eventId } = req.params;
      if (!eventId) return AppError.fromErrorCode(ErrorMap.EVENT_NOT_EXISTS);

      const now = new Date();
      const ticketTypes = await this.ticketTypeRepo.find({
        where: {
          event: { eventId: Number(eventId) },
          startSellDate: LessThan(now)
        }
      });

      return res.status(200).json({
        message: 'Lấy danh sách thành công',
        data: ticketTypes
      });
    } catch (error) {
      next(error);
    }
  };

  bookingTicketType = async (
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

        ticketTypeEntity.validate(ticketType, item, now);
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
      newBooking.eventId = +req.body.eventId;
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

  statsTicketType = async (req: Request, res: Response<BaseResponse<StatsTicketType[]>>, next: NextFunction) => {
    try {
      const eventId = parseInt(req.params.eventId);

      // Lấy tất cả ticket types thuộc event
      const ticketTypes = await this.ticketTypeRepo.find({
        where: { event: { eventId } },
        relations: ['event']
      });

      if (!ticketTypes || ticketTypes.length === 0) {
        throw AppError.fromErrorCode(ErrorMap.TICKET_TYPE_NOT_FOUND);
      }

      const totalTicket =
        (await this.ticketTypeRepo.sum('totalQuantity', {
          event: { eventId }
        })) ?? 0;

      const totalSoldTicket =
        (await this.ticketTypeRepo.sum('soldTicket', {
          event: { eventId }
        })) ?? 0;

      const overallPercentage = totalTicket && totalSoldTicket ? (totalSoldTicket / totalTicket) * 100 : 0;

      const statsData: StatsTicketType[] = ticketTypes.map((t) => ({
        ticketTypeName: t.ticketTypeName,
        totalQuantity: t.totalQuantity,
        soldTicket: t.soldTicket,
        totalTicket,
        totalSoldTicket,
        percentage: t.totalQuantity > 0 ? ((t.soldTicket / t.totalQuantity) * 100).toFixed(2) : 0,
        overallPercentage: overallPercentage.toFixed(2)
      }));

      return res.status(200).json({
        message: 'Stats successfully',
        data: statsData
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TicketTypeController();
