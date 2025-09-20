import { NextFunction, Request, Response } from 'express';
import { BaseResponse } from '../types/response.type';
import { Booking } from '../models/Booking.model';
import { Requester } from '../types';

class BookingController {
  async getMyBooking(req: Request, res: Response<BaseResponse<Booking>>, next: NextFunction) {
    try {
      const requester = res.locals.requester as Requester;
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();
