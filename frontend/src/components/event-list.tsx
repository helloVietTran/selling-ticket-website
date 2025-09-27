import React, { useEffect } from 'react';
import EventCard from '@/components/event-card';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import api from '@/api/api';
import type { Event } from '@/types';
import { useApi } from '@/api/hooks/useApi';
import { isAfter } from "date-fns";


export type PaginateResponse<T> = {
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};


export async function filterEvents(params: Record<string, any>): Promise<PaginateResponse<Event>> {
  const qs = new URLSearchParams(params).toString();
  const res = await api.get(`/events/filter?${qs}`);


  return res.data;
}

type EventListProps = {
  wrapperClassName?: string;
  category: string;
};

const EventList: React.FC<EventListProps> = ({ wrapperClassName = "", category }) => {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  const { data, exec, isPending, isError } = useApi(filterEvents);

  useEffect(() => {
    if (isSearchPage) {
      // lấy query string từ url, convert sang object
      const params = Object.fromEntries(new URLSearchParams(location.search));
      exec(params);
    } else {
      // trang khác /search -> chỉ dùng category + limit=4
      exec({ category, limit: 4 });
    }
  }, [location, category, isSearchPage, exec]);

  const events: Event[] = data?.data ?? [];

  return (
    <div className={wrapperClassName}>
      <div className="flex justify-between items-center mt-6 mb-4 px-1">
        <h2 className="text-white text-lg font-semibold">{category}</h2>

        {!isSearchPage && (
          <Link
            to={`/search?category=${category}`}
            className="flex items-center gap-1 text-gray-400 text-sm hover:text-gray-300 transition-all"
          >
            Xem thêm
            <ChevronRight className="size-4 text-inherit" />
          </Link>
        )}
      </div>

      {isPending && <p className="text-gray-400">Đang tải...</p>}
      {isError && <p className="text-red-400">Có lỗi xảy ra khi tải sự kiện</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {events.map((event: Event) => (
          <EventCard
            key={event.eventId}
            title={event.title}
            date={event.startTime}
            img={event.eventImage}
            status={isAfter(new Date(), new Date(event.endTime)) ? "Đã kết thúc" : ""}
            minPrice={event.minPriceTicketType}
            eventId={event.eventId}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;