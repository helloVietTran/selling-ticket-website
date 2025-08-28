import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Attendee } from "./Attendee.model";
import { BookingItem } from "./BookingItem.model";
import { Payment } from "./Payment.model";
import { BookingStatus } from "../types/enum";

@Entity("booking")
export class Booking {
  @PrimaryGeneratedColumn()
  bookingId!: number;

  @ManyToOne(() => Attendee, (a) => a.bookings)
  attendee!: Attendee;

  @OneToMany(() => BookingItem, (bi) => bi.booking, { cascade: true })
  bookingItems!: BookingItem[];

  @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.Created })
  status!: BookingStatus;

  @Column({ type: "timestamp", nullable: true })
  createdAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  expiresAt?: Date;

  // optional one-to-one to Payment
  @OneToOne(() => Payment, (p) => p.booking, { nullable: true })
  payment?: Payment;
}