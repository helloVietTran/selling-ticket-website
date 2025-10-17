import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { getProvinces } from 'sub-vn';

import EventItem from '@/features/organizer/components/event-item';
import StatusTabs from '@/components/status-tabs';
import SearchBox from '@/components/search-box';
import { LOCAL_STORAGE_KEYS } from '@/constant';
import { useApi } from '@/api/hooks/useApi';
import { getMyEvents } from '@/api/eventApi';
import type { Event } from '@/types';
import { formatDateTime } from '@/lib/formatDateTime';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 5;

const EventsPage = () => {
  const [keyword, setKeyword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const { exec, data: myEventsData } = useApi(getMyEvents);
  const status = searchParams.get('status');
  const keywordQuery = searchParams.get('keyword');

  const provinces = getProvinces();

  useEffect(() => {
    const organizerId = localStorage.getItem(LOCAL_STORAGE_KEYS.ORGANIZER_ID);
    if (!organizerId) return;

    exec(organizerId, {
      keyword: keywordQuery || undefined,
      status: status || '',
    });
  }, [keywordQuery, status]);

  const handleSearch = () => {
    setSearchParams({ keyword });
    setCurrentPage(1);
  };

  // --- Pagination logic ---
  const events = myEventsData?.data || [];
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return events.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [events, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <h2 className="font-semibold text-xl mb-4 flex gap-2 text-gray-300 mt-16">
        <ClipboardList />
        Sự kiện của tôi
      </h2>

      <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <SearchBox
            placeholder="Tìm sự kiện"
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
            className="w-full"
          />
        </div>

        <div className="flex-1 min-w-0">
          <StatusTabs />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {paginatedEvents.map((event: Event) => (
          <EventItem
            key={event.eventId}
            eventId={event.eventId}
            title={event.title}
            location={provinces.find((p: any) => p.code === event.venue.province)?.name}
            startDate={formatDateTime(event.startTime)}
            endDate={formatDateTime(event.endTime)}
            image={event.eventImage}
            eventStatus={event.status}
          />
        ))}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent className="flex items-center gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`
                      flex items-center gap-1 px-3 py-1 rounded-lg border 
                      transition-all duration-200
                      ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}
                    `}
                          >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Trước</span>
                  </PaginationPrevious>
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(i + 1)}
                      className={`
                px-3 py-1 rounded-lg border transition-all duration-200
                ${currentPage === i + 1
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'hover:bg-gray-100'
                        }
              `}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`
              flex items-center gap-1 px-3 py-1 rounded-lg border 
              transition-all duration-200
              ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}
            `}
                  >
                    <span>Tiếp</span>
                    <ChevronRight className="w-4 h-4" />
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
};

export default EventsPage;
