import { NextFunction, Request, Response } from 'express';
import { BaseResponse } from '../types/response.type';
import { config } from '../config/config';
import { format } from 'date-fns';
import qs from 'qs';
import crypto from 'crypto';
import request from 'request';
import { AppDataSource } from '../config/data-source';
import { Booking } from '../models/Booking.model';
import { Payment } from '../models/Payment.model';
import { BookingStatus } from '../types/enum';
import { CreatePaymentInput } from '../validators/payment.validate';

class PaymentController {
  private bookingRepo = AppDataSource.getRepository(Booking);
  private paymentRepo = AppDataSource.getRepository(Payment);

  createPaymentUrl = async (
    req: Request<{}, {}, CreatePaymentInput>,
    res: Response<BaseResponse<{ url: string }>>,
    next: NextFunction
  ) => {
    const booking = await this.bookingRepo.findOne({
      where: { bookingId: Number(req.body.orderId) }
    });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found!'
      });
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

    // lưu giao dịch là đã thanh toán
    // TODO: tạo callback để vnpay gọi sau khi đã thanh toán thành công => lúc này mới cập nhật db
    const payment = this.paymentRepo.create({
      amount,
      gatewayTransactionId: Date.now().toString(),
      createdAt: Date.now()
    });

    booking.status = BookingStatus.Paid;

    await this.bookingRepo.save(booking);
    await this.paymentRepo.save(payment);

    res.json({
      message: 'Create payment url successfull',
      data: { url: paymentUrl }
    });
  };

  querydr = async (req: Request, res: Response<BaseResponse<{ url: string }>>, next: NextFunction) => {
    const vnp_TmnCode = config.vnp.vnp_TmnCode;
    const vnp_HashSecret = config.vnp.vnp_HashSecret;
    const vnp_Api = config.vnp.query_transaction_api;

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;
    const date = new Date();

    const vnp_RequestId = format(date, 'HHmmss');
    const vnp_Version = '2.1.0';
    const vnp_Command = 'querydr';
    const vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

    const vnp_IpAddr = '127.0.0.1';
    const currCode = 'VND';
    const vnp_CreateDate = format(date, 'YYYYMMddHHmmss');

    const data =
      vnp_RequestId +
      '|' +
      vnp_Version +
      '|' +
      vnp_Command +
      '|' +
      vnp_TmnCode +
      '|' +
      vnp_TxnRef +
      '|' +
      vnp_TransactionDate +
      '|' +
      vnp_CreateDate +
      '|' +
      vnp_IpAddr +
      '|' +
      vnp_OrderInfo;
    if (!vnp_HashSecret) {
      throw new Error('Missing VNPAY hash secret!');
    }
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');

    let dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash
    };

    return new Promise((resolve, reject) => {
      request(
        {
          url: vnp_Api,
          method: 'POST',
          json: true,
          body: dataObj
        },
        (error, response, body) => {
          if (error) return reject(error);
          resolve(body);
        }
      );
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
