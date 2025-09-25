import { Calendar } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

type EventCardProps = {
  eventId: number;
  title: string;
  minPrice: number;
  date: string;
  img: string;
  status: string;

};

const EventCard: React.FC<EventCardProps> = ({
  title,
  minPrice,
  date,
  img,
  status,
  eventId

}) => {
  return (
    <Link
      to={`/events/${eventId}`}
      className="rounded-lg overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer text-white no-underline">
      <div className="relative">
        <img
          src={img}
          alt={title}
          className="w-full h-44 object-cover rounded-lg"
        />
        {status && (
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-tr-lg rounded-bl-lg">
            {status}
          </span>
        )}
      </div>
      <div className="py-3">
        <div className="font-bold text-sm mb-2 min-h-10">{title}</div>
        <div className="text-green-500 font-semibold mb-2 text-sm">
          Chỉ từ {minPrice}
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <span className="mr-2">
            <Calendar className="size-5" />
          </span>
          {date}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;