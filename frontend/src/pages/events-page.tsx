import EventItem, { mockEvents } from '@/components/event-item';
import SearchBox from '@/components/search-box';
import StatusTabs from '@/components/status-tabs';

const EventsPage = () => {
  return (
    <>
      <div className="py-6 flex items-center justify-between">
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
