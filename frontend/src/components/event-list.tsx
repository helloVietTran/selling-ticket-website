import React, { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import EventCard from '@/components/event-card';
import type { Event, GetEventsParams } from '@/types';
import { useApi } from '@/api/hooks/useApi';
import { getEvents } from '@/api/eventApi';
import { categoryLabels, EventCategory } from '@/constant';

type EventListProps = {
  category?: EventCategory;
};

const EventList: React.FC<EventListProps> = ({ category }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isSearchPage = location.pathname === '/search';

  const { data, exec } = useApi(getEvents);

  const startTime = searchParams.get('startDate') || undefined;
  const endTime = searchParams.get('endDate') || undefined;
  const province = searchParams.get('province') || undefined;
  const categories = searchParams.get('categories') || undefined;
  const keyword = searchParams.get('keyword') || undefined;

  useEffect(() => {
    const params: GetEventsParams = {};

    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (province) params.province = province;
    if (categories) params.category = categories;
    if (keyword) params.keyword = keyword;

    if (!isSearchPage && category) {
      params.category = category;
    }

    exec(params);
  }, [startTime, endTime, province, categories, keyword, category, isSearchPage]);

  const events: Event[] = data?.data ?? [];

  return (
    <>
      <div className="flex justify-between items-center mt-6 mb-4 px-1">
        {category && (
          <h2 className="text-white text-lg font-semibold">
            {categoryLabels[category]}
          </h2>
        )}

        {!isSearchPage && (
          <Link
            to={`/search?categories=${category}`}
            className="flex items-center gap-1 text-gray-400 text-sm hover:text-gray-300 transition-all"
          >
            Xem thêm
            <ChevronRight className="size-4 text-inherit" />
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          Không có sự kiện nào phù hợp với yêu cầu.
        </div>
      ) : isSearchPage ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
          {events.map((event: Event) => (
            <EventCard
              key={event.eventId}
              title={event.title}
              startTime={event.startTime}
              img={event.eventImage}
              status={event.status}
              minPrice={event.ticketTypes?.[0]?.price}
              eventId={event.eventId}
            />
          ))}
        </div>
      ) : (
        <div className="pb-6 overflow-x-hidden">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={false}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className="rounded-lg relative"
            loop={true}
          >
            {events.map((event: Event, index) => (
              <SwiperSlide key={`${event.eventId}-${index}`}>
                <EventCard
                  title={event.title}
                  startTime={event.startTime}
                  img={event.eventImage}
                  status={event.status}
                  minPrice={event.ticketTypes?.[0]?.price}
                  eventId={event.eventId}
                />
              </SwiperSlide>
            ))}

            <div className="swiper-button-prev-custom absolute top-1/3 -translate-y-1/2 left-2 bg-black text-white p-2.5 rounded-md cursor-pointer z-10 opacity-40 hover:opacity-100 transition">
              <ChevronRight className="rotate-180" size={20} />
            </div>
            <div className="swiper-button-next-custom absolute top-1/3 -translate-y-1/2 right-2 bg-black text-white p-2.5 rounded-md cursor-pointer z-10 opacity-40 hover:opacity-100 transition">
              <ChevronRight size={20} />
            </div>
          </Swiper>
        </div>
      )}
    </>
  );
};

export default EventList;
