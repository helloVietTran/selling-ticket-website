import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { useApi } from '@/api/hooks/useApi';
import { getEventById } from '@/api/eventApi';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import EventTicketCard from '@/features/event-detail/components/event-ticket-card';
import EventDescription from '@/features/event-detail/components/event-description';
import TicketTypeList from '@/features/event-detail/components/ticket-type-list';
import OrganizerCard from '@/features/event-detail/components/organizer-card';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data, exec, isPending, isError } = useApi(getEventById);

  useEffect(() => {
    if (eventId) exec(eventId);
  }, [eventId]);

  // useEffect(() => {
  //   if (isError || !data?.data) {
  //     navigate('/not-found', { replace: true });
  //   }
  // }, [isError, data, navigate]);

  if (isPending) {
    return <p className="text-center py-10">Đang tải chi tiết sự kiện...</p>;
  }

  const event = data?.data;

  if (!event) return null;

  return (
    <>
      <Navigation />
      <div
        className="p-4 bg-banner"
        style={{
          background:
            'linear-gradient(rgb(39, 39, 42) 48.04%, rgb(0, 0, 0) 100%)',
        }}>
        <EventTicketCard
          title={event.title}
          date={format(event.startTime, 'dd/MM/yyyy', { locale: vi })}
          time={format(event.startTime, 'HH:mm', { locale: vi })}
          province={event.venue.province}
          address={
            event.venue.street +
            ', ' +
            event.venue.ward +
            ', ' +
            event.venue.district
          }
          price={event.minPriceTicketType}
          image={event.eventImage}
        />
      </div>

      <div className="px-4 py-6 space-y-6 bg-[#f6f7fc]">
        <EventDescription htmlContent={event.eventInfo} />
        <TicketTypeList ticketTypes={event.ticketTypes} />

        <OrganizerCard
          name={event.organizer.organizerName}
          description={event.organizer.organizerInfo}
        />
      </div>

      <Footer />
    </>
  );
};

export default EventDetailPage;
