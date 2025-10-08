// src/entities/transaction-history.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, } from 'typeorm';
import { Event } from './Event.model';
import { User } from './User.model';

@Entity('transaction_history')
export class TransactionHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Column({ name: 'user_id' })      // người mua vé
  userId!: number;

  @Column({ name: 'organizer_id' }) // người tổ chức sự kiện
  organizerId!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
