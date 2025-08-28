import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Booking } from "./Booking.model";

@Entity("payment")
export class Payment {
  @PrimaryGeneratedColumn()
  paymentId!: number;

  @OneToOne(() => Booking, (b) => b.payment)
  @JoinColumn()
  booking!: Booking;

  @Column("double precision")
  amount!: number;

  @Column({ nullable: true })
  gatewayTransactionId?: number;

  @Column("int", { nullable: true })
  methodType?: number;
}