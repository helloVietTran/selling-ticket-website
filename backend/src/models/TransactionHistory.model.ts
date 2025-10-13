import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transaction_history')
export class TransactionHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'booking_id' })
  bookingId!: number;

  @Column('double precision')
  amount!: number;

  @Column({ type: 'datetime' })
  createdAt!: Date;
}
