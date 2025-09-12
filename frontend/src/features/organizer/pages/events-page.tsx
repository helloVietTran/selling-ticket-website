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
      <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <SearchBox
          placeholder="Tìm sự kiện"
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          className="w-full lg:w-auto"
        />
        <div className="w-full lg:w-auto">
          <StatusTabs />
        </div>
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
