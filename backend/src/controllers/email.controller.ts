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
import { email } from 'zod';

class emailController { 
  private userRepo = AppDataSource.getRepository(User); 
  private ticketRepo = AppDataSource.getRepository(Ticket); 
  private ticketTypeRepo = AppDataSource.getRepository(TicketType); 
  private eventRepo = AppDataSource.getRepository(Event); 

  sendEmailQR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, eventId, ticketTypeId } = req.body;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'vanhanguyen2k4@gmail.com',
        pass: 'qgby epus qbdi cskj'
      }
    });

    const user = await this.userRepo.findOne({ where: { email } });
    const event = await this.eventRepo.findOne({
      where: { eventId },
      relations: ['organizer']
    });
    const ticketType = await this.ticketTypeRepo.findOne({ where: { ticketTypeId } });
    const ticket = await this.ticketRepo.findOne({ where: { ticketType: ticketTypeId } });

    if (!event || !user || !ticket || !ticketType || !event.organizer) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
    }

    const ticketData = {
      userName: user.userName,
      eventName: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      stand: ticket.seatNumber || '0',
      ticketType: ticketType.ticketTypeName,
      price: ticketType.price || 0,
      year: new Date().getFullYear(),
      organizationName: event.organizer.organizationName || ' '
    };

    // 1) QR payload
    const qrPayload = JSON.stringify({
      organization: ticketData.organizationName,
      name: ticketData.userName,
      event: ticketData.eventName
    });

    // 2) Tạo QR buffer
    const qrBuffer = await QRCode.toBuffer(qrPayload, {
      type: 'png',
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 400
    });

    // 3) Load template
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
      .replace(/{{organizerName}}/g, ticketData.organizationName)
      .replace(/{{qrSrc}}/g, 'cid:qr1'); // fix chỗ cid

    // 4) Gửi mail
    const mailOptions = {
      from: `"Ban Tổ Chức" <${process.env.SMTP_USER}>`,
      to: "nguyentieubao96@gmail.com", // gửi cho user
      subject: `Vé của bạn cho ${ticketData.eventName}`,
      html,
      attachments: [{ filename: 'qr.png', content: qrBuffer, cid: 'qr1' }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent:', info.messageId);

    return res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Send email error:', error);
    return res.status(500).json({ message: 'Failed to send email', error });
  }
};
}

export default new emailController();

