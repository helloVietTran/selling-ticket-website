import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { TicketType } from '@/types';
import { Link } from 'react-router-dom';

type TicketTypeListProps = {
  ticketTypes: TicketType[];
  eventId: string | number;
};


export default function TicketTypeList({ ticketTypes, eventId }: TicketTypeListProps) {
  const [openId, setOpenId] = useState<number | null>(null);
  const now = new Date();

  const toggleDetails = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const renderButton = (ticketType: TicketType) => {
    const startDate = new Date(ticketType.startSellDate);
    const endDate = new Date(ticketType.endSellDate);

    if (ticketType.soldTicket >= ticketType.totalQuantity) {
      return (
        <Link to={`/events/${eventId}/select-ticket`}>
          <Button
            disabled
            className="bg-red-500 text-white font-semibold cursor-not-allowed"
          >
            Hết vé
          </Button>
        </Link>
      );
    }

    if (now < startDate) {
      return (
        <Link to={`/events/${eventId}/select-ticket`}>
          <Button
            disabled
            className="bg-gray-400 text-black font-semibold cursor-not-allowed"
          >
            Chưa mở bán
          </Button>
        </Link>
      );
    }

    if (now > endDate) {
      return (
        <Link to={`/events/${eventId}/select-ticket`}>
          <Button
            disabled
            className="bg-gray-400 text-black font-semibold cursor-not-allowed"
          >
            Đã đóng bán
          </Button>
        </Link>
      );
    }

    return (
      <Link to={`/events/${eventId}/select-ticket`}>
        <Button className="bg-emerald-500 hover:bg-emerald-600 font-semibold text-white">
          Mua vé ngay
        </Button>
      </Link>
    );
  };

  return (
    <Card className="bg-neutral-900 text-white rounded-2xl shadow-md border border-neutral-800 w-full max-w-3xl">
      <div className="px-6 py-4 text-lg font-semibold">Thông tin vé</div>

      {ticketTypes.map((ticketType) => (
        <div
          key={ticketType.ticketTypeId}
          className="border-t border-neutral-800"
        >
          <div
            className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-neutral-800/60"
            onClick={() => toggleDetails(ticketType.ticketTypeId)}
          >
            <div className="flex items-center gap-3">
              <ChevronRight
                className={`w-5 h-5 transition-transform ${openId === ticketType.ticketTypeId ? 'rotate-90' : ''
                  }`}
              />
              <span>{ticketType.ticketTypeName}</span>
            </div>
            {renderButton(ticketType)}
          </div>

          {openId === ticketType.ticketTypeId && (
            <CardContent className="bg-neutral-800 px-6 py-4 space-y-3">

              <div className="flex justify-between text-sm text-neutral-200">
                <span>Giá vé</span>
                <span className="font-semibold text-emerald-400">
                  {ticketType.price.toLocaleString()} VND
                </span>
              </div>
              <div className="flex justify-between text-sm text-neutral-200">
                <span>Còn lại</span>
                <span>
                  {ticketType.totalQuantity - ticketType.soldTicket} vé
                </span>
              </div>

              <div className="flex justify-between text-sm text-neutral-200">
                <span>Thời gian mở bán</span>
                <span>
                  {new Date(ticketType.startSellDate).toLocaleString('vi-VN')}
                </span>
              </div>

            </CardContent>
          )}
        </div>
      ))}
    </Card>
  );
}
