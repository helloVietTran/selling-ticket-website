import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Event = {
  id: number;
  img: string;
  alt: string;
  href: string;
};

const events: Event[] = [
  {
    id: 1,
    img: 'https://picsum.photos/id/1011/800/400',
    alt: 'Event 1',
    href: 'detail.html',
  },
  {
    id: 2,
    img: 'https://picsum.photos/id/1015/800/400',
    alt: 'Event 2',
    href: 'detail.html',
  },
  {
    id: 3,
    img: 'https://picsum.photos/id/1025/800/400',
    alt: 'Event 3',
    href: 'detail.html',
  },
  {
    id: 4,
    img: 'https://picsum.photos/id/1035/800/400',
    alt: 'Event 4',
    href: 'detail.html',
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
            <a href={event.href} className="relative block">
              <img
                src={event.img}
                alt={event.alt}
                className="w-full rounded-lg cursor-pointer"
              />
              <button className="absolute bottom-4 left-4 bg-white text-black px-3 py-2 text-sm rounded hover:bg-emerald-500 hover:text-white transition cursor-pointer">
                Xem chi tiết
              </button>
            </a>
          </SwiperSlide>
        ))}

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
