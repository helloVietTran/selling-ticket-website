import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Event } from './Event.model';
import { Ticket } from './Ticket.model';

@Entity('ticket_type')
export class TicketType {
  @PrimaryGeneratedColumn({ name: 'ticket_type_id' })
  ticketTypeId!: number;

  @Column({ type: 'varchar', length: 100 })
  ticketTypeName!: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  totalQuantity!: number;

  @Column({ type: 'int', default: 0 })
  soldTicket!: number;

  @Column({ type: 'int', default: 1 })
  maxPerUser!: number;

  @Column({ type: 'int', default: 1 })
  minPerUser!: number;

  @Column({ type: 'decimal', default: 0 })
  price!: number;

  @Column({ type: 'timestamp' })
  startSellDate!: Date;

  @Column({ type: 'timestamp' })
  endSellDate!: Date;

  @ManyToOne(() => Event, (e) => e.ticketTypes,{onDelete: 'CASCADE'})
  @JoinColumn({ name: 'eventId', referencedColumnName: 'eventId' })
  event!: Event;

  @OneToMany(() => Ticket, (t) => t.ticketType, { cascade: true })
  tickets!: Ticket[];
}
