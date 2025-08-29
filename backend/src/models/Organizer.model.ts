import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from './User.model';
import { Event } from './Event.model';

@ChildEntity('organizer')
export class Organizer extends User {
  @Column({ nullable: true })
  organizationName?: string;

  @OneToMany(() => Event, (event) => event.organizer)
  events!: Event[];
}
