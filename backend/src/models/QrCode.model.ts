import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Ticket } from './Ticket.model';

@Entity('qrcode')
export class QrCode {
  @PrimaryColumn()
  ticketId!: number;

  @OneToOne(() => Ticket, (t) => t.qrCode, )
  ticket!: Ticket;

  @Column({ type: 'timestamp', nullable: true })
  issuedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ nullable: true })
  randomCode?: string;
}
