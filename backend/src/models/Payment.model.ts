import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Booking } from './Booking.model';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  paymentId!: number;

  @Column('double precision')
  amount!: number;

  @Column({ nullable: false })
  gatewayTransactionId?: string;

  @Column({ type: 'datetime', nullable: true })
  createdAt!: Date;
}
