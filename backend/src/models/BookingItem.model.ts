import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Booking } from './Booking.model';
import { TicketType } from './TicketType.model';

@Entity('booking_item')
export class BookingItem {
  @PrimaryGeneratedColumn()
  bookingItemId!: number;

  @ManyToOne(() => TicketType)
  ticketType!: TicketType;

  @Column('int')
  quantity!: number;

  @ManyToOne(() => Booking, (b) => b.bookingItems)
  booking!: Booking;
}
