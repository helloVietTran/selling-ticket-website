import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Booking } from "../models/Booking.model";
import { Ticket } from "../models/Ticket.model";
import { QrCode } from "../models/QrCode.model";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { Repository } from "typeorm";
import ApiResponse from "../utils/ApiResponse";

class TicketController {
  private bookingRepo: Repository<Booking> = AppDataSource.getRepository(Booking);
  private ticketRepo: Repository<Ticket> = AppDataSource.getRepository(Ticket);
  private qrRepo: Repository<QrCode> = AppDataSource.getRepository(QrCode);

  generateTickets = async (req: Request, res: Response) => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { bookingId } = req.body;

      const booking = await queryRunner.manager.findOne(Booking, {
        where: { bookingId },
        relations: ["attendee", "bookingItems", "bookingItems.ticketType"], 
      });

      if (!booking) {
        return res.status(404).json(
          ApiResponse.error({
            code: "BOOKING_NOT_FOUND",
            message: "Booking not found",
            statusCode: 404,
          })
        );
      }

      const ticketsResponse: any[] = [];

      for (const item of booking.bookingItems) {
        for (let i = 0; i < item.quantity; i++) {
          // Tạo ticket
          const ticket = queryRunner.manager.create(Ticket, {
            ticketType: item.ticketType,
            owner: booking.attendee,
            checkedIn: false,
          });
          await queryRunner.manager.save(ticket);

          // Tạo QR Code
          const randomCode = uuidv4();
          const issuedAt = new Date();
          const expiresAt = undefined;

          const qrEntity = queryRunner.manager.create(QrCode, {
            ticket,
            issuedAt,
            expiresAt,
            randomCode,
          });
          await queryRunner.manager.save(qrEntity);

          // Generate QR Image
          const payload = { issuedAt, expiresAt, randomCode };
          const qrImage = await QRCode.toDataURL(JSON.stringify(payload));

          // Tạo object trả về API
          ticketsResponse.push({
            ticketId: ticket.ticketId,
            bookingId: booking.bookingId,
            ticketType: item.ticketType.ticketTypeName,
            attendeeId: booking.attendee?.id,
            checkedIn: ticket.checkedIn,
            qrCode: {
              issuedAt,
              expiresAt,
              randomCode,
              image: qrImage,
            },
          });
        }
      }

      await queryRunner.commitTransaction();

      return res.json(ApiResponse.success(ticketsResponse, "Tickets generated successfully"));
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      return res.status(500).json(
        ApiResponse.error({
          code: "ERROR_GENERATING_TICKETS",
          message: error.message || "Error generating tickets",
          statusCode: 500,
        })
      );
    } finally {
      await queryRunner.release();
    }
  };
}

export default new TicketController();
