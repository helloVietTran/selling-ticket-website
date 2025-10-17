import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EventStatus } from '@/constant';
import { formatDateTime } from '@/lib/formatDateTime';
import { formatVND } from '@/lib/formatVND';

type EventCardProps = {
  eventId: number;
  title: string;
  minPrice: number;
  startTime: string;
  img?: string;
  status?: string;
};

const EventCard: React.FC<EventCardProps> = ({
  eventId,
  title,
  minPrice,
  startTime,
  img,
  status,
}) => {
  const fallbackInitial = title ? title.charAt(0).toUpperCase() : '?';

  return (
    <Link
      to={`/events/${eventId}`}
      className="rounded-lg overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer text-white no-underline">
      <div className="relative">
        <Avatar className="w-full h-50 rounded-xl">
          <AvatarImage
            src={img}
            alt={title}
            className="object-cover w-full h-full"
          />
          <AvatarFallback className="bg-gray-600 text-white text-2xl font-bold rounded-xl">
            {fallbackInitial}
          </AvatarFallback>
        </Avatar>

        {status == EventStatus.ONGOING && (
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-tr-lg rounded-bl-lg">
            Đang diễn ra
          </span>
        )}
        {status == 'ENDED' && (
          <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-tr-lg rounded-bl-lg">
            Đã kết thúc
          </span>
        )}
      </div>

      <div className="py-3">
        <div className="font-bold text-sm mb-2 min-h-10">{title}</div>
        <div className="text-green-500 font-semibold mb-2 text-sm">
          Chỉ từ {formatVND(minPrice)}
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <span className="mr-2">
            <Calendar className="size-5" />
          </span>
          {formatDateTime(startTime)}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
