import React, { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom'; // Sử dụng useLocation và useSearchParams để lấy tham số tìm kiếm từ URL
import { ChevronRight } from 'lucide-react'; // icon mũi tên
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper React components
import { Navigation, Pagination } from 'swiper/modules'; // Thêm Pagination module
// Import Swiper styles
import 'swiper/css'; // core Swiper
import 'swiper/css/navigation'; // Navigation module
import 'swiper/css/pagination'; // Pagination module

import EventCard from '@/components/event-card';
import type { Event, GetEventsParams } from '@/types';
import { useApi } from '@/api/hooks/useApi';
import { getEvents } from '@/api/eventApi';
import { categoryLabels, EventCategory } from '@/constant'; // import categoryLabels
// định nghĩa kiểu props cho component
type EventListProps = {
  category?: EventCategory;
}; // có thể không truyền category

// component danh sách sự kiện

const EventList: React.FC<EventListProps> = ({ category }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams(); // hook lấy tham số tìm kiếm từ URL
  const isSearchPage = location.pathname === '/search'; // kiểm tra xem có phải trang tìm kiếm không

  const { data, exec } = useApi(getEvents);

  const startTime = searchParams.get('startDate') || undefined;
  const endTime = searchParams.get('endDate') || undefined;
  const province = searchParams.get('province') || undefined;
  const categories = searchParams.get('categories') || undefined;
  const keyword = searchParams.get('keyword') || undefined;
// gọi api khi các tham số tìm kiếm thay đổi
  useEffect(() => {
    const params: GetEventsParams = {};

    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (province) params.province = province;
    if (categories) params.category = categories;
    if (keyword) params.keyword = keyword;
// nếu không phải trang tìm kiếm và có category, thêm category vào params
    if (!isSearchPage && category) {
      params.category = category;
    }

    exec(params);
  }, [startTime, endTime, province, categories, keyword, category, isSearchPage]);

  const events: Event[] = data?.data ?? []; // danh sách sự kiện từ kết quả api hoặc mảng rỗng nếu không có

  return (
    <>
      <div className="flex justify-between items-center mt-6 mb-4 px-1">
        {category && (
          <h2 className="text-white text-lg font-semibold">
            {categoryLabels[category]}
          </h2>
        )} {/* hiển thị tiêu đề nếu có category */}

        {!isSearchPage && (
          <Link
            to={`/search?categories=${category}`}
            className="flex items-center gap-1 text-gray-400 text-sm hover:text-gray-300 transition-all"
          >
            Xem thêm
            <ChevronRight className="size-4 text-inherit" />
          </Link>
        )} {/* hiển thị link xem thêm nếu không phải trang tìm kiếm */}
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
        </div> /* hiển thị dạng lưới nếu là trang tìm kiếm */
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
          > {/* hiển thị dạng slider nếu không phải trang tìm kiếm */}
            {events.map((event: Event, index) => ( /* duyệt qua danh sách sự kiện và hiển thị từng thẻ sự kiện trong SwiperSlide */
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
            ))} {/* hiển thị các nút điều hướng tùy chỉnh */}

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
