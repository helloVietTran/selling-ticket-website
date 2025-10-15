import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { BookingItem } from './BookingItem.model';
import { BookingStatus } from '../types/enum';
import { User } from './User.model';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn()
  bookingId!: number;

  @Column({ type: 'int', nullable: false })
  eventId!: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.Waiting })
  status!: BookingStatus;

  @Column({ type: 'timestamp', nullable: false })
  createdAt?: Date;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt?: Date;

  @Column({ type: 'int', nullable: false })
  amount!: number;

  @ManyToOne(() => User, (a) => a.bookings)
  attendee!: User;

  @OneToMany(() => BookingItem, (bi) => bi.booking, { cascade: true })
  bookingItems!: BookingItem[];
}
