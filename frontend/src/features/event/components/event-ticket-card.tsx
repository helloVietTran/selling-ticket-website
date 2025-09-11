import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EventTicketCardProps = {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: string;
  image: string;
};

const EventTicketCard: React.FC<EventTicketCardProps> = ({
  title,
  date,
  time,
  location,
  address,
  price,
  image,
}) => {
  return (
    <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-lg">
      {/* Image (ở trên trên mobile; phải trên desktop) */}
      <div
        className="
          w-full
          lg:flex-[6.5]
          lg:h-[430px]
          lg:order-2
        "
      >
        <img
          src={image}
          alt={title}
          className="
            w-full h-full object-cover
            rounded-t-2xl        /* mobile: bo góc trên */
            lg:rounded-t-none lg:rounded-r-2xl /* desktop: bo góc phải */
          "
        />
      </div>

      {/* Card (ở dưới mobile; trái desktop) */}
      <Card
        className={`
          bg-text-wrapper text-white
          p-4 lg:p-6                 /* padding nhỏ trên mobile, lớn trên desktop */
          w-full
          lg:flex-[3.5]
          lg:order-1
          rounded-b-2xl             /* mobile: bo góc dưới */
           rounded-t-none
          lg:rounded-b-none lg:rounded-l-2xl /* desktop: bo góc trái */
          border-none flex flex-col relative
        `}
      >
        <CardContent className="p-2 lg:p-4 flex flex-col flex-1 gap-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold uppercase">{title}</h2>

            {/* Date */}
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <Calendar className="w-5 h-5" />
              <span>
                {time}, {date}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 text-gray-300 mt-2">
              <MapPin className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-white">{location}</p>
                <p className="text-sm">{address}</p>
              </div>
            </div>
          </div>

          {/* Price + Button stick bottom */}
          <div className="border-t border-gray-600 pt-4 mt-auto">
            <p className="text-lg font-semibold">
              Giá từ <span className="text-emerald-400">{price}</span>
            </p>
            <Button className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
              Mua vé ngay
            </Button>
          </div>

          {/* circles: ẩn trên mobile, hiện trên desktop */}
          <span className="hidden lg:block circle-1"></span>
          <span className="hidden lg:block circle-2"></span>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventTicketCard;
