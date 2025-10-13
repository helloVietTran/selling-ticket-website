import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import EventItem from '@/features/organizer/components/event-item';
import StatusTabs from '@/components/status-tabs';
import SearchBox from '@/components/search-box';
import { LOCAL_STORAGE_KEYS } from '@/constant';
import { useApi } from '@/api/hooks/useApi';
import { getMyEvents } from '@/api/eventApi';
import type { Event } from '@/types';
import { formatDateTime } from '@/lib/formatDateTime';

const EventsPage = () => {
  const [keyword, setKeyword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const { exec, data: myEventsData } = useApi(getMyEvents);
  const status = searchParams.get('status');
  const keywordQuery = searchParams.get('keyword');

  useEffect(() => {
    const organizerId = localStorage.getItem(LOCAL_STORAGE_KEYS.ORGANIZER_ID);
    if (!organizerId) return;

    exec(
      organizerId,
      {
        keyword: keywordQuery || undefined,
        status: status || '',
      }
    );
  }, [keywordQuery, status]);

  const handleSearch = () => {
    setSearchParams({ keyword });
  };


  return (
    <>
      <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <SearchBox
          placeholder="Tìm sự kiện"
          value={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
          className="w-full lg:w-auto"
        />
        <div className="w-full lg:w-auto">
          <StatusTabs />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {myEventsData && myEventsData.data.map((event: Event) => (
          <EventItem
            key={event.eventId}
            eventId={event.eventId}
            title={event.title}
            location={event.venue.province}
            startDate={formatDateTime(event.startTime)}
            endDate={formatDateTime(event.endTime)}
            image={event.eventImage}
            eventStatus={event.status}
          />
        ))}
      </div>
    </>
  );
};

export default EventsPage;
