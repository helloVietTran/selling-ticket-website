import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import pLimit from 'p-limit';

import { AppDataSource } from '../config/data-source';
import { Event } from '../models/Event.model';
import { User } from '../models/User.model';
import { Ticket } from '../models/Ticket.model';
import { TicketState } from '../types/enum';
import { config } from '../config/config';

class EmailController {
  private ticketRepo = AppDataSource.getRepository(Ticket);
  private eventRepo = AppDataSource.getRepository(Event);
  private userRepo = AppDataSource.getRepository(User);

  async sendTicketEmail(ticket: Ticket) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      }
    });

    const event = await this.eventRepo.findOne({
      where: { eventId: ticket.eventId },
      relations: ['organizer']
    });

    const user = await this.userRepo.findOne({ where: { id: ticket.ownerId } });

    if (!event || !user || !event.organizer) return;

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

    const qrPayload = JSON.stringify({
      eventId: event.eventId,
      userId: user.id,
      code: ticket.qrCode?.randomCode,
      ticketId: ticket.ticketId
    });
    const qrBuffer = await QRCode.toBuffer(qrPayload, {
      type: 'png',
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 400
    });

    let html;
    try {
      const templatePath = path.join(__dirname, '../../template/sendEmail.html');
      html = fs.readFileSync(templatePath, 'utf8');
    } catch (err: any) {
      console.error('Không tìm thấy file template:', err.message);
      return;
    }

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

    const mailOptions = {
      from: 'Ban tổ chức nhóm 1',
      to: 'numberzero0909@gmail.com',
      subject: `Vé của bạn cho ${ticketData.eventName}`,
      html,
      attachments: [{ filename: 'qr.png', content: qrBuffer, cid: 'qr1' }]
    };

    await transporter.sendMail(mailOptions);
  }

  async sendAllTicketsMail() {
    try {
      const tickets = await this.ticketRepo.find({
        where: { ticketStatus: TicketState.Available },
        relations: ['ticketType', 'qrCode']
      });

      if (!tickets.length) {
        console.log('No available tickets to send.');
        return;
      }

      const limit = pLimit(3); // Gửi tối đa 3 email cùng lúc
      const tasks = tickets.map((ticket) => limit(() => this.sendTicketEmail(ticket)));

      await Promise.all(tasks); // gửi mail song song cho tối ưu
    } catch (error) {
      console.error('Error sending ticket emails:', error);
    }
  }
}

export default new EmailController();
