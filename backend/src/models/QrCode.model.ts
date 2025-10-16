import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './Ticket.model';

@Entity('qrcode')
export class QrCode {
  @PrimaryGeneratedColumn()
  qrCodeId!: number;

  @Column({ type: 'timestamp', nullable: true })
  issuedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ nullable: true })
  randomCode?: string;

  @OneToOne(() => Ticket, (t) => t.qrCode, { onDelete: 'CASCADE' })
  ticket!: Ticket;
}
