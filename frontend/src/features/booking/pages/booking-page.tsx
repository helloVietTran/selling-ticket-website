import { useApi } from '@/api/hooks/useApi';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import EventBanner from '@/features/booking/components/event-banner';
import BookingInfo from '@/features/booking/components/booking-info';
import { getEventById } from '@/api/eventApi';
import { formatRangeTime } from '@/lib/formatDateTime';
import { deleteMyBookingById, getMyBooking } from '@/api/bookingApi';
import { payBooking } from '@/api/paymentApi';
import type { CreatePaymentPayload } from '@/types';

const BookingPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const { data: eventData, exec: fetchEvent } = useApi(getEventById);
  const { data: myBookingData, exec: fetchBooking } = useApi(getMyBooking);
  const { exec: deleteMyBooking } = useApi(deleteMyBookingById);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
      fetchBooking();
    }
  }, [eventId]);


  const event = eventData?.data;
  const booking = myBookingData?.data;
  if (!event || !booking) return <div>Loading...</div>;

  const handleDeleteBooking = async (bookingId: string | number) => {
    try {
      await deleteMyBooking(bookingId);
      navigate(`/events/${event.eventId}/select-ticket`)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePayBooking = async (data: CreatePaymentPayload) => {
    try {
      const res = await payBooking(data);
      const paymentUrl = res.data?.url;

      if (paymentUrl) {
        window.open(paymentUrl, '_blank');
        navigate(`/my/tickets`)
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-main-content min-h-[90vh] !p-0 space-y-4 !pb-4">
      <EventBanner
        eventId={event.eventId}
        title={event.title}
        datetime={formatRangeTime(event.startTime, event.endTime)}
        location={event.venue.street}
        expiresAt={booking.expiresAt}
      />

      <BookingInfo
        ticketTypes={
          booking.bookingItems.map(item => ({
            ticketTypeName: item.ticketType.ticketTypeName,
            price: Number(item.ticketType.price),
            quantity: item.quantity,
          }))
        }
        onChangeTicket={() => handleDeleteBooking(booking.bookingId)}
        onContinue={() => handlePayBooking({ orderId: booking.bookingId, eventId: event.eventId })}
      />
    </div>
  );
};

export default BookingPage;
