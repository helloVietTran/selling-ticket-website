import cron from 'node-cron';
import { AppDataSource } from '../../config/data-source';
import { Booking } from '../../models/Booking.model';
import { TicketType } from '../../models/TicketType.model';
import { BookingStatus } from '../../types/enum';
import { LessThan } from 'typeorm';

export const startCronTicketBooking = () => {
  const bookingRepo = AppDataSource.getRepository(Booking);
  const ticketTypeRepo = AppDataSource.getRepository(TicketType);

  cron.schedule('*/15 * * * *', async () => {
    const expiredBookings = await bookingRepo.find({
      where: { status: BookingStatus.Waiting, expiresAt: LessThan(new Date()) },
      relations: ['bookingItems', 'bookingItems.ticketType'],
    });

    for (const booking of expiredBookings) {
      for (const item of booking.bookingItems) {
        const ticketType = item.ticketType;
        ticketType.soldTicket -= item.quantity;
        if (ticketType.soldTicket < 0) ticketType.soldTicket = 0;
        await ticketTypeRepo.save(ticketType);
      }
      booking.status = BookingStatus.Expired;
      await bookingRepo.save(booking);
    }
  });
};
