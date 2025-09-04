import EventItem, { mockEvents } from '@/features/organizer/components/event-item';
import SearchBox from '@/features/organizer/components/search-box';
import StatusTabs from '@/components/status-tabs';

const EventsPage = () => {
  return (
    <>
      <div className="flex items-center justify-between pb-6">
        <SearchBox />
        <StatusTabs />
      </div>
      <div className="flex flex-col gap-4">
        {mockEvents.map(event => (
          <EventItem key={event.id} {...event} />
        ))}
      </div>
    </>
  );
};

export default EventsPage;
