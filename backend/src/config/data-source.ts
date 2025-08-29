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
import { Event } from '../models/Event.model';
import { Organizer } from '../models/Organizer.model';
import { Attendee } from '../models/Attendee.model';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: "root",
  database: "event_ticket_db",
  synchronize: true, // dev only
  logging: false,
  entities: [User, QrCode, Ticket, Event, Venue, TicketType, Booking, BookingItem, Payment, Organizer, Attendee],
  migrations: [],
  subscribers: []
});