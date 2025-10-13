import { NextFunction, Request, Response } from 'express';
import { BaseResponse } from '../types/response.type';
import { config } from '../config/config';
import { format } from 'date-fns';
import qs from 'qs';
import crypto from 'crypto';

import { AppDataSource } from '../config/data-source';
import { Booking } from '../models/Booking.model';
import { BookingStatus } from '../types/enum';
import { CreatePaymentInput } from '../validators/payment.validate';
import { TransactionHistory } from '../models/TransactionHistory.model';
import { Requester } from '../types';
import ticketController from './ticket.controller';
import { User } from '../models/User.model';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import emailController from './email.controller';

class PaymentController {
  private bookingRepo = AppDataSource.getRepository(Booking);
  private userRepo = AppDataSource.getRepository(User);
  private transactionHistoryRepo = AppDataSource.getRepository(TransactionHistory);

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

    if (!user) {
      throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
    }

    if (!booking) {
      throw AppError.fromErrorCode(ErrorMap.BOOKING_NOT_FOUND);
    }
    // thong tin don hang
    const date = new Date();
    const createDate = format(date, 'yyyyMMddHHmmss');
    const orderId = req.body.orderId;
    const amount = booking.amount;

    // thong tin config vnpay
    const tmnCode = config.vnp.vnp_TmnCode;
    const vnp_HashSecret = config.vnp.vnp_HashSecret;
    const vnp_Url = config.vnp.payment_api;
    const returnUrl = 'http://localhost:5173/my/tickets'; //return về my ticket page

    const locale = 'vn';
    const currCode = 'VND';
    const ipAddr = '127.0.0.1';

    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = this.sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });

    if (!vnp_HashSecret) {
      throw new Error('Missing VNPAY hash secret!');
    }
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });

    // tạm lưu giao dịch là đã thanh toán
    // TODO: tạo callback để vnpay gọi sau khi đã thanh toán thành công => lúc này mới cập nhật db
    const payment = this.transactionHistoryRepo.create({
      amount,
      createdAt: new Date(),
      bookingId: booking.bookingId,
      userId: +requester.id
    });

    booking.status = BookingStatus.Paid;

    await this.bookingRepo.save(booking);
    await this.transactionHistoryRepo.save(payment);
    // create ticket
    ticketController.generateTickets(booking, user, req.body.eventId);

    res.json({
      message: 'Create payment url successfull',
      data: { url: paymentUrl }
    });
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
