import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

import { TicketType } from '../models/TicketType.model';
import { AppDataSource } from '../config/data-source';
import { Event } from '../models/Event.model';
import { User } from '../models/User.model';
import { Ticket } from '../models/Ticket.model';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { TicketState } from '../types/enum';

class EmailController {
  private ticketRepo = AppDataSource.getRepository(Ticket);
  private eventRepo = AppDataSource.getRepository(Event);
  private userRepo = AppDataSource.getRepository(User);

  // TODO: đẩy mail vào hàng đợi
  sendTicketMail = async () => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'vanhanguyen2k4@gmail.com',
          pass: 'qgby epus qbdi cskj'
        }
      });

      const ticket = await this.ticketRepo.findOne({
        where: { ticketStatus: TicketState.Available },
        relations: ['ticketType']
      });

      const event = await this.eventRepo.findOne({
        where: { eventId: ticket?.eventId },
        relations: ['organizer']
      });

      const user = await this.userRepo.findOne({
        where: { id: ticket?.ownerId }
      });

      if (!event || !user || !ticket || !event.organizer) {
        throw AppError.fromErrorCode(ErrorMap.INTERNAL_SERVER);
      }

      const ticketData = {
        userName: user.userName,
        eventName: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
        stand: ticket.seatNumber || '0',
        ticketType: ticket.ticketType.ticketTypeName,
        price: ticket.ticketType.price || 0,
        year: new Date().getFullYear(),
        organizerName: event.organizer.organizerName || ' '
      };

      //  QR payload
      const qrPayload = JSON.stringify({
        eventId: event.eventId,
        userId: user.id
      });

      // Tạo QR buffer
      const qrBuffer = await QRCode.toBuffer(qrPayload, {
        type: 'png',
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 400
      });

      // Load template
      const templatePath = path.join(__dirname, '../teamplate/sendEmail.html');
      let html = fs.readFileSync(templatePath, 'utf8');

      html = html
        .replace(/{{userName}}/g, ticketData.userName)
        .replace(/{{eventName}}/g, ticketData.eventName)
        .replace(/{{eventDate}}/g, ticketData.startTime.toDateString())
        .replace(/{{seat}}/g, ticketData.stand.toString())
        .replace(/{{ticketType}}/g, ticketData.ticketType)
        .replace(/{{year}}/g, ticketData.year.toString())
        .replace(/{{price}}/g, ticketData.price.toString())
        .replace(/{{organizerName}}/g, ticketData.organizerName)
        .replace(/{{qrSrc}}/g, 'cid:qr1');

      // Gửi mail
      const mailOptions = {
        from: `"Ban Tổ Chức" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: `Vé của bạn cho ${ticketData.eventName}`,
        html,
        attachments: [{ filename: 'qr.png', content: qrBuffer, cid: 'qr1' }]
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Send email error:', error);
    }
  };
}

export default new EmailController();
