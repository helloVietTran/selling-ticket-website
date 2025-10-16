import { NextFunction, Request, Response } from 'express';
import { BaseResponse } from '../types/response.type';
import { config } from '../config/config';
import { format } from 'date-fns';
import qs from 'qs';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { AppDataSource } from '../config/data-source';
import { Booking } from '../models/Booking.model';
import { BookingStatus, TicketState } from '../types/enum';
import { CreatePaymentInput } from '../validators/payment.validate';
import { TransactionHistory } from '../models/TransactionHistory.model';
import { Requester } from '../types';
import { User } from '../models/User.model';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { QrCode } from '../models/QrCode.model';
import { Ticket } from '../models/Ticket.model';

class PaymentController {
  private bookingRepo = AppDataSource.getRepository(Booking);
  private userRepo = AppDataSource.getRepository(User);

  createPaymentUrl = async (
    req: Request<{}, {}, CreatePaymentInput>,
    res: Response<BaseResponse<{ url: string }>>,
    next: NextFunction
  ) => {
    const requester = res.locals.requester as Requester;

    const user = await this.userRepo.findOne({
      where: { id: Number(requester.id) }
    });

    const booking = await this.bookingRepo.findOne({
      where: { bookingId: Number(req.body.orderId) },
      relations: ['attendee', 'bookingItems', 'bookingItems.ticketType']
    });

    if (!user) throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
    if (!booking) throw AppError.fromErrorCode(ErrorMap.BOOKING_NOT_FOUND);

    // Build VNPAY payment url
    const date = new Date();
    const createDate = format(date, 'yyyyMMddHHmmss');
    const orderId = req.body.orderId;
    const amount = booking.amount;

    const tmnCode = config.vnp.vnp_TmnCode;
    const vnp_HashSecret = config.vnp.vnp_HashSecret;
    const vnp_Url = config.vnp.payment_api;
    const returnUrl = 'http://localhost:5173/my/tickets';

    const locale = 'vn';
    const currCode = 'VND';
    const ipAddr = req.ip || '127.0.0.1';

    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate
    };

    vnp_Params = this.sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    if (!vnp_HashSecret) throw new Error('Missing VNPAY hash secret!');

    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lưu transaction history
      const payment = queryRunner.manager.create(TransactionHistory, {
        amount,
        createdAt: new Date(),
        bookingId: booking.bookingId,
        userId: +requester.id,
        eventId: req.body.eventId
      });
      await queryRunner.manager.save(payment);

      booking.status = BookingStatus.Paid;
      await queryRunner.manager.save(booking);

      //  Tạo ticket + qrcode cho từng booking item
      for (const item of booking.bookingItems) {
        for (let i = 0; i < item.quantity; i++) {
          const randomCode = uuidv4();
          const issuedAt = new Date();
          const qrEntity = queryRunner.manager.create(QrCode, {
            randomCode,
            issuedAt
          });
          const savedQr = await queryRunner.manager.save(qrEntity);

          const ticket = queryRunner.manager.create(Ticket, {
            ticketType: item.ticketType,
            ownerId: user.id,
            eventId: req.body.eventId,
            checkedIn: false,
            seatNumber: 1, // tạm để số ghế là 1
            ticketStatus: TicketState.Available,
            qrCode: savedQr
          });
          await queryRunner.manager.save(ticket);
        }
      }

      await queryRunner.commitTransaction();

      res.json({
        message: 'Create payment url successfull',
        data: { url: paymentUrl }
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      next(error);
    } finally {
      await queryRunner.release();
    }
  };

  private sortObject(obj: Record<string, string | number>): Record<string, string> {
    const sorted: Record<string, string> = {};
    const keys: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        keys.push(encodeURIComponent(key));
      }
    }

    keys.sort();

    for (const key of keys) {
      const value = obj[decodeURIComponent(key)];
      sorted[key] = encodeURIComponent(String(value)).replace(/%20/g, '+');
    }

    return sorted;
  }
}

export default new PaymentController();
