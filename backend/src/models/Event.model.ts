import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Organizer } from './Organizer.model';
import { Venue } from './Venue.model';
import { TicketType } from './TicketType.model';
import { EventStatus } from '../types/types';
import { Category } from './Category.model';
import { EmailSetting } from './EmailSetting.model';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  eventId!: number;

  @Column()
  title!: string;

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ type: 'timestamp' })
  endTime!: Date;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.Draft })
  status!: EventStatus;

  @Column({ type: 'text' })
  eventInfo!: string;

  @Column({ nullable: true })
  capacity?: number;

  @OneToOne(() => Venue, (v) => v.event, { nullable: false, cascade: true })
  @JoinColumn({ name: 'venueId', referencedColumnName: 'venueId' })
  venue!: Venue;

  @ManyToOne(() => Organizer, (o) => o.events, { nullable: false })
  @JoinColumn({ name: 'organizerId' })
  organizer!: Organizer;

  @OneToMany(() => TicketType, (ticket) => ticket.event, { cascade: true })
  ticketTypes!: TicketType[];

  @ManyToOne(() => Category, (c) => c.events, { nullable: false })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'categoryId' })
  category!: Category;

  @OneToOne(() => EmailSetting, { nullable: true, cascade: true })
  @JoinColumn({ name: 'emailSettingId', referencedColumnName: 'emailSettingId' })
  emailSetting?: EmailSetting | null;
}
