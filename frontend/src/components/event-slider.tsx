import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Event = {
  id: number;
  img: string;
  alt: string;
  href: string;
};

const events: Event[] = [
  {
    id: 1,
    img: 'http://localhost:3001/uploads/1760628307703-508454613.jpg',
    alt: 'Event 1',
    href: '/events/1',
  },
  {
    id: 2,
    img: 'http://localhost:3001/uploads/1760629236185-304620039.jpg',
    alt: 'Event 2',
    href: '/events/2',
  },
  {
    id: 3,
    img: 'http://localhost:3001/uploads/1760629437327-588735914.jpg',
    alt: 'Event 3',
    href: '/events/3',
  },
];

const EventSlider: React.FC = () => {
  return (
    <div className="py-6 overflow-x-hidden">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
        }}
        className="rounded-lg relative"
        loop={true}>
        {events.map(event => (
          <SwiperSlide key={event.id}>
            <Link to={event.href} className="relative block group">
              <img
                src={event.img}
                alt={event.alt}
                className="w-full rounded-lg cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <button className="absolute bottom-4 left-4 bg-white text-black px-3 py-2 text-sm rounded shadow-md hover:bg-emerald-500 hover:text-white transition">
                Xem chi tiết
              </button>
            </Link>
          </SwiperSlide>
        ))}

        {/* Nút điều hướng custom */}
        <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-2 bg-black text-white p-3 rounded-md cursor-pointer z-10 opacity-40 hover:opacity-100 transition">
          <ChevronLeft />
        </div>
        <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-2 bg-black text-white p-3 rounded-md cursor-pointer z-10 opacity-40 hover:opacity-100 transition">
          <ChevronRight />
        </div>
      </Swiper>
    </div>
  );
};

export default EventSlider;
