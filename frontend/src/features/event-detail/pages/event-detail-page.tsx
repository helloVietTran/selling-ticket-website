import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProvinces, getDistricts, getWards } from 'sub-vn';

import { useApi } from '@/api/hooks/useApi';
import { getEventById } from '@/api/eventApi';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import EventTicketCard from '@/features/event-detail/components/event-ticket-card';
import EventDescription from '@/features/event-detail/components/event-description';
import TicketTypeList from '@/features/event-detail/components/ticket-type-list';
import OrganizerCard from '@/features/event-detail/components/organizer-card';
import { Loader2 } from 'lucide-react';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data, exec, isPending } = useApi(getEventById);

  useEffect(() => {
    if (eventId) exec(eventId);
  }, [eventId]);

  const provinces = getProvinces();
  const districts = getDistricts();
  const wards = getWards();

  const event = data?.data;

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Đang tải chi tiết sự kiện...</p>
      </div>
    );
  }

  if (!event) {
    navigate('/not-found');
    return;
  }

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
          eventId={event.eventId}
          title={event.title}
          startTime={event.startTime}
          endTime={event.endTime}
          province={
            provinces.find((p: any) => p.code === event.venue.province)?.name
          }
          address={
            `${event.venue.street}, ` +
            `${wards.find((w: any) => w.code === event.venue.ward)?.name}, ` +
            `${
              districts.find((d: any) => d.code === event.venue.district)?.name
            }, `
          }
          price={Math.min(...event.ticketTypes.map((t: any) => t.price))}
          image={event.eventImage}
        />
      </div>

      <div className="px-4 py-6 space-y-6 bg-[#f6f7fc]">
        <EventDescription htmlContent={event.eventInfo} />
        <TicketTypeList
          ticketTypes={event.ticketTypes}
          eventId={event.eventId}
        />

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
