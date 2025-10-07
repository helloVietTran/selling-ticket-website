import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Role } from '../types/enum';
import { Ticket } from './Ticket.model';
import { Booking } from './Booking.model';
import { Organizer } from './Organizer.model';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';

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

  validate = (email: string, userName: string, password: string): void => {
    const regex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
    if (!regex.test(email)) {
      throw AppError.fromErrorCode(ErrorMap.FORMAT_EMAIL_INCORRECT);
    }
    if (!email) {
      throw AppError.fromErrorCode(ErrorMap.EMAIL_NOT_FOUND);
    } else if (!userName) {
      throw AppError.fromErrorCode(ErrorMap.USERNAME_NOT_FOUND);
    } else {
      throw AppError.fromErrorCode(ErrorMap.PASSWORD_NOT_FOUND);
    }
  };
}
