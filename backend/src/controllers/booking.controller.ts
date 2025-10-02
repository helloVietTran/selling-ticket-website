import { NextFunction, Request, Response } from 'express';
import { BaseResponse } from '../types/response.type';
import { Booking } from '../models/Booking.model';
import { Requester } from '../types';
import { User } from '../models/User.model';
import { AppDataSource } from '../config/data-source';
import { MoreThan } from 'typeorm';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';

const userRepo = AppDataSource.getRepository(User);
const bookingRepo = AppDataSource.getRepository(Booking);

class BookingController {
  async getMyBooking(req: Request, res: Response<BaseResponse<Booking[]>>, next: NextFunction) {
    try {
      const requester = res.locals.requester as Requester;
      const user = await userRepo.findOneBy({ id: Number(requester.id) });
      if (!user) throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      const myBooking = await bookingRepo.find({
        where: {
          attendee: { id: user.id },
          expiresAt: MoreThan(new Date())
        },
        relations: {
          bookingItems: {
            ticketType: true
          }
        }
      });

      return res.status(200).json({
        message: 'Lấy danh sách thành công',
        data: myBooking
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();
