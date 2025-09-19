import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Role } from '../types/enum';
import { Ticket } from './Ticket.model';
import { Booking } from './Booking.model';
import { Organizer } from './Organizer.model';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50 })
  userName!: string;

  @Column({ type: 'varchar' })
  passwordHash!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: Role
  })
  roles!: Role;

  @OneToMany(() => Ticket, (ticket) => ticket.owner)
  tickets!: Ticket[];

  @OneToMany(() => Booking, (booking) => booking.attendee)
  bookings!: Booking[];

  @OneToOne(() => Organizer, (organizer) => organizer.user, {
    nullable: true,
    eager: true
  })
  @JoinColumn({ name: 'organizerId', referencedColumnName: 'organizerId' })
  organizer?: Organizer;
}
