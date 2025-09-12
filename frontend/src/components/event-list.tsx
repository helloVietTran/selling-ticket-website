import React from 'react';
import EventCard from '@/components/event-card';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const events = [
  {
    title: 'GARDEN ART - FRUIT MOCHI CHEESECAKE',
    price: '390.000đ',
    date: '11/09/2025',
    img: 'https://picsum.photos/400/200?5',
  },
  {
    title: 'WORKSHOP PERFUME - LÀM NƯỚC HOA',
    price: '279.000đ',
    date: '06/09/2025',
    img: 'https://picsum.photos/400/200?6',
  },
  {
    title: 'MOSS FRAME - TRANH THIÊN NHIÊN',
    price: '315.000đ',
    date: '31/05/2025',
    img: 'https://picsum.photos/400/200?7',
  },
  {
    title: 'ROLLERBALL PERFUME WORKSHOP',
    price: '279.000đ',
    date: '06/09/2025',
    img: 'https://picsum.photos/400/200?8',
  },
];

type EventListProps = {
  wrapperClassName?: string;
  category: string;
};

const EventList: React.FC<EventListProps> = ({
  wrapperClassName = '',
  category,
}) => {
  return (
    <div className={wrapperClassName}>
      <div className="flex justify-between items-center mt-6 mb-4 px-1">
        <h2 className="text-white text-lg font-semibold">{category}</h2>
        <Link
          to={''}
          className="flex items-center gap-1 text-gray-400 text-sm hover:text-gray-300 transition-all">
          Xem thêm <ChevronRight className="size-4 text-inherit" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {events.map((event, index) => (
          <EventCard key={index} {...event} href="#" />
        ))}
      </div>
    </div>
  );
};

export default EventList;
