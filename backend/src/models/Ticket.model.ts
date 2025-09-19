import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QrCode } from './QrCode.model';
import { TicketState } from '../types/enum';
import { TicketType } from './TicketType.model';
import { User } from './User.model';

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn()
  ticketId!: number;

  @Column({ type: 'enum', enum: TicketState, default: TicketState.Available })
  ticketStatus!: TicketState;

  @Column('boolean')
  checkedIn!: boolean;

  @Column({ nullable: true })
  seatNumber?: number;

  @ManyToOne(() => TicketType, (tt) => tt.tickets, { nullable: false })
  ticketType!: TicketType;

  @ManyToOne(() => User, (u) => u.tickets, { nullable: false })
  owner?: User;

  @OneToOne(() => QrCode, (q) => q.ticket, { cascade: true })
  @JoinColumn({ name: 'ticketId' })
  qrCode?: QrCode;
}
