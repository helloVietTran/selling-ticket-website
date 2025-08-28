import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './config';
import { User } from '../models/User.model';
import { QrCode } from '../models/QrCode.model';
import { Ticket } from '../models/Ticket.model';
import { Venue } from '../models/Venue.model';
import { TicketType } from '../models/TicketType.model';
import { Booking } from '../models/Booking.model';
import { BookingItem } from '../models/BookingItem.model';
import { Payment } from '../models/Payment.model';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.db.host,
  port: Number(config.db.port),
  username: config.db.user,
  password: config.db.pass,
  database: config.db.name,
  synchronize: true, // dev only
  logging: false,
  entities: [User, QrCode, Ticket, Event, Venue, TicketType, Booking, BookingItem, Payment],
  migrations: [],
  subscribers: []
});
