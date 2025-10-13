import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Event } from './Event.model';
import { User } from './User.model';

@Entity('organizer')
export class Organizer {
  @PrimaryGeneratedColumn()
  organizerId!: number;

  @Column({ nullable: true })
  organizerName?: string;

  @Column({ nullable: true })
  organizerInfo?: string;

  @OneToMany(() => Event, (event) => event.organizer)
  events!: Event[];

  @OneToOne(() => User, (user) => user.organizer)
  user!: User;
}
