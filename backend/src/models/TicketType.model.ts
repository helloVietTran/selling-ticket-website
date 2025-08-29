// file: src/entities/TicketType.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Event } from './Event.model';
import { Ticket } from './Ticket.model';

@Entity('ticket_type')
export class TicketType {
  @PrimaryGeneratedColumn()
  ticketTypeId!: number;

  @Column()
  ticketTypeName!: string;

  @Column({ nullable: true })
  stand?: string;

  @Column('int')
  totalQuantity!: number;

  @Column('int')
  availableQuantity!: number;

  @Column('double precision')
  price!: number;

  @ManyToOne(() => Event, (e) => e.ticketTypes)
  event!: Event;

  @OneToMany(() => Ticket, (t) => t.ticketType)
  tickets!: Ticket[];
}
