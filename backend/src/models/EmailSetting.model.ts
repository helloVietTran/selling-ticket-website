import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Event } from './Event.model';

@Entity('email_setting')
export class EmailSetting {
  @PrimaryGeneratedColumn()
  emailSettingId!: number;

  @Column({ nullable: false })
  messageToReceiver!: string;

  @OneToOne(() => Event, (tt) => tt.emailSetting)
  event!: Event;
}
