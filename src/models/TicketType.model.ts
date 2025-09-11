// file: src/entities/TicketType.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,JoinColumn } from 'typeorm';
import { Event } from './Event.model';
import { Ticket } from './Ticket.model';
import { boolean } from 'zod';

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
  
  @Column("int")
  soldTicket!:number;
  
  @Column('int')
  availableQuantity!: number;

  @Column('double precision')
  price!: number;
  
  @ManyToOne(() => Event, (e) => e.ticketTypes)
  @JoinColumn({ name: "event" }) 
  event!: Event;

  @OneToMany(() => Ticket, (t) => t.ticketType)
  tickets!: Ticket[];
}
