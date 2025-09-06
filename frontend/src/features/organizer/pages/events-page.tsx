import React from 'react';

import EventItem, {
  mockEvents,
} from '@/features/organizer/components/event-item';
import StatusTabs from '@/components/status-tabs';
import SearchBox from '@/components/search-box';

const EventsPage = () => {
  const [query, setQuery] = React.useState('');

  const handleSearch = () => {
    console.log('Searching for:', query);
  };
  return (
    <>
      <div className="flex items-center justify-between pb-6">
        <SearchBox
          placeholder="Tìm sự kiện"
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
        />
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
