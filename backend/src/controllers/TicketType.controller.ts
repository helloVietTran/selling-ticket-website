import { Request, Response, NextFunction } from 'express';
import { TicketType } from '../models/TicketType.model';
import { AppDataSource } from '../config/data-source';
import { Ticket } from '../models/Ticket.model';
import ApiResponse from '../utils/ApiResponse';
import { ErrorMap } from '../config/ErrorMap';
import { IErrorCode } from '../config/ErrorMap';
import { BaseResponse } from '../types/response.type';
import { SelectTicketInput } from '../validators/ticket.validate';
import { Booking } from '../models/Booking.model';
import { AppError } from '../config/exception';
import { Requester } from '../types';
import { User } from '../models/User.model';
import { BookingStatus } from '../types/enum';
import { BookingItem } from '../models/BookingItem.model';
import cron from 'node-cron';
import { LessThan } from 'typeorm/find-options/operator/LessThan';

const bookingRepo = AppDataSource.getRepository(Booking);
const ticketTypeRepo = AppDataSource.getRepository(TicketType);
const ticketRepo = AppDataSource.getRepository(Ticket);

class TicketTypeController {
  async getTicketTypesByEventId(req: Request, res: Response<BaseResponse<TicketType[]>>, next: NextFunction) {
    try {
      const { eventId } = req.params;
      if (!eventId) return AppError.fromErrorCode(ErrorMap.EVENT_NOT_EXISTS);
      const ticketTypes = await ticketTypeRepo.findBy({ event: { eventId: Number(eventId) } });
      return res.status(200).json({ message: 'Lấy danh sách thành công', data: ticketTypes });
    } catch (error) {
      next(error);
    }
  }

  async bookingTicket(
    req: Request<{}, {}, SelectTicketInput>,
    res: Response<BaseResponse<Booking>>,
    next: NextFunction
  ) {
    // Bắt đầu một transaction để đảm bảo tính toàn vẹn dữ liệu
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const requester = res.locals.requester as Requester;
      const userId = requester.id;
      const { ticketTypes } = req.body;

      if (!ticketTypes || ticketTypes.length === 0) {
        throw AppError.fromErrorCode(ErrorMap.TICKET_TYPE_NOT_FOUND);
      }
      if (!userId) return 0;
      // 1. Lấy thông tin người dùng
      const user = await queryRunner.manager.findOneBy(User, { id: Number(userId) });
      if (!user) {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      }

      let totalAmount = 0;
      const bookingItems: BookingItem[] = [];
      const now = new Date();

      // 2. Lặp qua từng loại vé để kiểm tra và tính toán
      for (const item of ticketTypes) {
        const ticketType = await queryRunner.manager.findOneBy(TicketType, { ticketTypeId: Number(item.ticketTypeId) });

        // -- VALIDATION --
        if (!ticketType) {
          throw AppError.fromErrorCode(ErrorMap.TICKET_TYPE_NOT_FOUND);
        }
        if (item.quantity <= 0) {
          throw AppError.fromErrorCode(ErrorMap.TICKET_TYPE_IMPOSITIVE);
        }
        if (now < ticketType.startSellDate || now > ticketType.endSellDate) {
          throw AppError.fromErrorCode(ErrorMap.NOT_AVAILABLE_AT_TIME);
        }
        if (ticketType.totalQuantity - ticketType.soldTicket < item.quantity) {
          throw AppError.fromErrorCode(ErrorMap.NOT_ENOUGH_STOCK);
        }
        if (item.quantity < ticketType.minPerUser || item.quantity > ticketType.maxPerUser) {
          throw AppError.fromErrorCode(ErrorMap.QUANTITY_OVER_LIMIT);
        }

        //Tăng soldTicket tạm thời
        ticketType.soldTicket += item.quantity;
        await queryRunner.manager.save(ticketType);

        // -- TÍNH TOÁN VÀ TẠO BOOKING ITEM --
        totalAmount += Number(ticketType.price) * item.quantity;

        const newBookingItem = new BookingItem();
        newBookingItem.ticketType = ticketType;
        newBookingItem.quantity = item.quantity;
        bookingItems.push(newBookingItem);
      }

      // 3. Tạo Booking mới
      const newBooking = new Booking();
      newBooking.attendee = user;
      newBooking.bookingItems = bookingItems; // Gán các booking item
      newBooking.amount = totalAmount;
      newBooking.status = BookingStatus.Waiting; // Trạng thái chờ thanh toán
      newBooking.createdAt = new Date();
      // Đơn đặt vé sẽ hết hạn sau 15 phút nếu không thanh toán
      newBooking.expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Gán booking cho từng booking item (cần thiết cho quan hệ hai chiều)
      bookingItems.forEach((item) => (item.booking = newBooking));

      // 4. Lưu Booking vào cơ sở dữ liệu (cascade sẽ tự động lưu các BookingItem)
      const savedBooking = await queryRunner.manager.save(newBooking);

      // Nếu mọi thứ thành công, commit transaction
      await queryRunner.commitTransaction();

      cron.schedule('*/15 * * * *', async () => {

        // Lấy booking đã hết hạn nhưng vẫn đang ở trạng thái "Waiting"
        const expiredBookings = await bookingRepo.find({
          where: {
            status: BookingStatus.Waiting,
            expiresAt: LessThan(new Date())
          },
          relations: ['bookingItems', 'bookingItems.ticketType']
        });

        for (const booking of expiredBookings) {
          for (const item of booking.bookingItems) {
            const ticketType = item.ticketType;

            // Hồi phục lại soldTicket
            ticketType.soldTicket -= item.quantity;
            if (ticketType.soldTicket < 0) ticketType.soldTicket = 0;

            await ticketTypeRepo.save(ticketType);
          }

          // Đánh dấu booking là expired - Hết hạn
          booking.status = BookingStatus.Expired;
          await bookingRepo.save(booking);
        }
      });
      res.status(201).json({
        message: 'Booking created successfully. Please proceed to payment.',
        data: savedBooking
      });
    } catch (error) {
      console.log("loiox")
      // Nếu có lỗi, rollback tất cả các thay đổi
      await queryRunner.rollbackTransaction();
      next(error);
    } finally {
      // Giải phóng query runner
      await queryRunner.release();
    }
  }
}

export default new TicketTypeController();
