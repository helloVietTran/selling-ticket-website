import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Organizer } from './Organizer.model';
import { Venue } from './Venue.model';
import { TicketType } from './TicketType.model';
import { EventStatus } from '../types/enum';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  eventId!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ type: 'timestamp' })
  endTime!: Date;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.Draft })
  status!: EventStatus;

  @Column({ nullable: true })
  capacity?: number;

  @ManyToOne(() => Venue, (v) => v.events, { nullable: true })
  venue?: Venue;

  @ManyToOne(() => Organizer, (o) => o.events, { nullable: false })
  organizer!: Organizer;

  @OneToMany(() => TicketType, (tt) => tt.event)
  ticketTypes!: TicketType[];
}
