import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Event } from './Event.model';

@Entity('venue')
export class Venue {
  @PrimaryGeneratedColumn()
  venueId!: number;

  @Column()
  province!: string;

  @Column()
  district!: string;

  @Column()
  street!: string;

  @Column()
  ward!: string;

  @OneToOne(() => Event, (event) => event.venue,{cascade: true,onDelete: 'CASCADE' })
  event!: Event;
}
