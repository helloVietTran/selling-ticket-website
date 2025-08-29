import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from './User.model';
import { Ticket } from './Ticket.model';
import { Booking } from './Booking.model';

@ChildEntity('attendee')
export class Attendee extends User {
  @Column({ nullable: true })
  phoneNumber?: string;

  @OneToMany(() => Ticket, (ticket) => ticket.owner)
  tickets!: Ticket[];

  @OneToMany(() => Booking, (booking) => booking.attendee)
  bookings!: Booking[];
}
