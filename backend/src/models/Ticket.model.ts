import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QrCode } from './QrCode.model';
import { TicketState } from '../types/enum';
import { TicketType } from './TicketType.model';
import { Attendee } from './Attendee.model';

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn()
  ticketId!: number;

  @Column({ type: 'enum', enum: TicketState, default: TicketState.Available })
  ticketStatus!: TicketState;

  @Column("boolean")
  checkedIn!:boolean;
  
  @Column({ nullable: true })
  seatNumber?: number;

  @ManyToOne(() => TicketType, (tt) => tt.tickets, { nullable: false })
  ticketType!: TicketType;

  @ManyToOne(() => Attendee, (a) => a.tickets, { nullable: true })
  owner?: Attendee;
  
  
  @OneToOne(() => QrCode, (q) => q.ticket, { cascade: true })
  @JoinColumn({ name: 'ticketId' })
  qrCode?: QrCode;
}
