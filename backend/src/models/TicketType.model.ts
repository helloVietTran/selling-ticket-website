import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Event } from './Event.model';
import { Ticket } from './Ticket.model';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { BookingItem } from './BookingItem.model';

@Entity('ticket_type')
export class TicketType {
  @PrimaryGeneratedColumn({ name: 'ticket_type_id' })
  ticketTypeId!: number;

  @Column({ type: 'varchar', length: 100 })
  ticketTypeName!: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  totalQuantity!: number;

  @Column({ type: 'int', default: 0 })
  soldTicket!: number;

  @Column({ type: 'int', default: 1 })
  maxPerUser!: number;

  @Column({ type: 'int', default: 1 })
  minPerUser!: number;

  @Column({ type: 'decimal', default: 0 })
  price!: number;

  @Column({ type: 'timestamp' })
  startSellDate!: Date;

  @Column({ type: 'timestamp' })
  endSellDate!: Date;

  @ManyToOne(() => Event, (e) => e.ticketTypes,{onDelete: 'CASCADE'})
  @JoinColumn({ name: 'eventId', referencedColumnName: 'eventId' })
  event!: Event;

  @OneToMany(() => Ticket, (t) => t.ticketType, { cascade: true })
  tickets!: Ticket[];

  validate = async (ticketType: any, item: { ticketTypeId: string; quantity: number }, now: Date): Promise<void> => {
    if (!ticketType) {
      throw AppError.fromErrorCode(ErrorMap.TICKET_TYPE_NOT_FOUND);
    }
    if (item.quantity <= 0) {
      throw AppError.fromErrorCode(ErrorMap.TICKET_TYPE_IMPOSITIVE);
    }
    if (now < ticketType.startSellDate || now > ticketType.endSellDate) {
      throw AppError.fromErrorCode(ErrorMap.NOT_AVAILABLE_AT_TIME);
    }
    if (ticketType.totalQuantity - ticketType.soldTicket < item.quantity) {
      throw AppError.fromErrorCode(ErrorMap.NOT_ENOUGH_STOCK);
    }
    if (item.quantity < ticketType.minPerUser || item.quantity > ticketType.maxPerUser) {
      throw AppError.fromErrorCode(ErrorMap.QUANTITY_OVER_LIMIT);
    }
  };
}
