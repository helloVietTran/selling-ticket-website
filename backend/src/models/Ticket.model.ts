import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QrCode } from './QrCode.model';
import { TicketState } from '../types/enum';
import { TicketType } from './TicketType.model';

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

  @Column({type: 'int'})
  ownerId!: number;

  @Column({type: 'int'})
  eventId!: number;

  @ManyToOne(() => TicketType, (tt) => tt.tickets, { nullable: false, onDelete: 'CASCADE' })
  ticketType!: TicketType;

  @OneToOne(() => QrCode, (q) => q.ticket, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
  qrCode?: QrCode;
}
