import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventBanner from '@/features/booking/components/event-banner';
import BookingInfo from '@/features/booking/components/booking-info';
import { useApi } from '@/api/hooks/useApi';
import { getEventById } from '@/api/eventApi';
import { getMyBooking } from '@/api/bookingApi';

const BookingPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: eventData, exec: fetchEvent } = useApi(getEventById);
  const { data: myBookingData, exec: fetchMyBooking } = useApi(getMyBooking);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
      fetchMyBooking();
    }
  }, [eventId]);

  const event = eventData?.data;
  const booking = myBookingData?.data;

  return (
    <div className="bg-main-content min-h-[90vh] !p-0 space-y-4 !pb-4">
      {event && (
        <EventBanner
          title={event.title}
          datetime={`${event.startTime} - ${event.endTime}`}
          location={event.venue.district + ', ' + event.venue.province + ', ' + event.venue.street + ', ' + event.venue.ward}
          initialMinutes={15}
        />
      )}

      <BookingInfo
        tickets={booking.bookingItem.ticketType}
        onChangeTicket={() => alert('Chọn lại vé')}
        onContinue={() => alert('Tiếp tục đặt vé')}
      />
    </div>
  );
};

export default BookingPage;