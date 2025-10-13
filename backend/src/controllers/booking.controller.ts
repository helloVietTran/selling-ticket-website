import { NextFunction, Request, Response } from 'express';
import { MoreThan } from 'typeorm';

import { BaseResponse } from '../types/response.type';
import { Booking } from '../models/Booking.model';
import { Requester } from '../types';
import { User } from '../models/User.model';
import { AppDataSource } from '../config/data-source';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';

class BookingController {
  private userRepo = AppDataSource.getRepository(User);
  private bookingRepo = AppDataSource.getRepository(Booking);

  getMyBooking = async (req: Request, res: Response<BaseResponse<Booking>>, next: NextFunction) => {
    try {
      const requester = res.locals.requester as Requester;

      const user = await this.userRepo.findOneBy({ id: Number(requester.id) });
      if (!user) throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);

      const myBooking = await this.bookingRepo.find({
        where: {
          attendee: { id: user.id },
          expiresAt: MoreThan(new Date())
        },
        relations: {
          bookingItems: { ticketType: true }
        },
        order: { createdAt: 'DESC' }
      });

      return res.status(200).json({
        message: 'Lấy booking gần nhất thành công.',
        data: myBooking[0] ?? null
      });
    } catch (error) {
      next(error);
    }
  };

  deleteBookingById = async (req: Request, res: Response<BaseResponse<null>>, next: NextFunction) => {
    try {
      const requester = res.locals.requester as Requester;
      const bookingId = Number(req.params.bookingId);

      if (!bookingId) {
        throw AppError.fromErrorCode(ErrorMap.BOOKING_ID_REQUIRED);
      }

      const booking = await this.bookingRepo.findOne({
        where: { bookingId },
        relations: { attendee: true }
      });

      if (!booking) {
        throw AppError.fromErrorCode(ErrorMap.BOOKING_NOT_FOUND);
      }

      if (booking.attendee.id !== Number(requester.id)) {
        throw AppError.fromErrorCode(ErrorMap.UNAUTHORIZED);
      }

      await this.bookingRepo.remove(booking);

      return res.status(200).json({
        message: 'Xóa booking thành công.',
        data: null
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new BookingController();
