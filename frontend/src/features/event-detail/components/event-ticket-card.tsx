import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VerticalDashed from './vertical-dashed';
import { Link } from 'react-router-dom';

type EventTicketCardProps = {
  eventId: number | string;
  title: string;
  date: string;
  province: string;
  address: string;
  price: number;
  image: string;
};

const EventTicketCard: React.FC<EventTicketCardProps> = ({
  eventId,
  title,
  date,
  province,
  address,
  price,
  image,
}) => {
  return (
    <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-lg">
      <div
        className="
          w-full
          lg:flex-[6.5]
          lg:h-[430px]
          lg:order-2
        ">
        <img
          src={image}
          alt={title}
          className="
            w-full h-full object-cover
            rounded-t-2xl       
            lg:rounded-t-none lg:rounded-r-2xl 
          "
        />
      </div>

      <Card
        className={`
          bg-text-wrapper text-white
          p-4 lg:p-6                
          w-full
          lg:flex-[3.5]
          lg:order-1
          rounded-b-2xl             
           rounded-t-none
          lg:rounded-b-none lg:rounded-l-2xl 
          border-none flex flex-col relative
        `}>
        <div className="hidden lg:block absolute right-[-4px] top-0 h-full -translate-x-1/2 z-10">
          <VerticalDashed height="100%" />
        </div>
        <CardContent className="p-2 lg:p-4 flex flex-col flex-1 gap-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold uppercase">{title}</h2>

            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <Calendar className="w-5 h-5" />
              <span>
                {date}
              </span>
            </div>

            <div className="flex items-start gap-2 text-gray-300 mt-2">
              <MapPin className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-white">{province}</p>
                <p className="text-sm">{address}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4 mt-auto">
            <p className="text-lg font-semibold">
              Giá từ <span className="text-emerald-400">{price}</span>
            </p>
            <Link to={`/events/${eventId}/select-ticket`}>
              <Button className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                Mua vé ngay
              </Button>
            </Link>
          </div>

          <span className="hidden lg:block circle-1"></span>
          <span className="hidden lg:block circle-2"></span>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventTicketCard;
