import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface TicketType {
  ticketTypeName: string;
  price: number;
  quantity: number;
}

interface BookingInfoProps {
  ticketTypes: TicketType[];
  onChangeTicket?: () => void;
  onContinue?: () => void;
}

export default function BookingInfo({
  ticketTypes,
  onChangeTicket,
  onContinue,
}: BookingInfoProps) {
  const total = ticketTypes.reduce((sum, t) => sum + t.price * t.quantity, 0);
  const totalQuantity = ticketTypes.reduce((sum, t) => sum + t.quantity, 0);

  return (
    <Card className="rounded-2xl shadow-md border border-gray-200 max-w-xl mx-auto p-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Thông tin đặt vé
          </h2>
          <button
            onClick={onChangeTicket}
            className="text-base text-blue-500 hover:underline">
            Chọn lại vé
          </button>
        </div>

        <div className="mt-4 border-b border-dashed border-gray-300 pb-3">
          <div className="flex justify-between text-base font-semibold text-gray-600">
            <span>Loại vé</span>
            <span>Số lượng</span>
          </div>

          {ticketTypes.map((ticketType, idx) => (
            <div
              key={idx}
              className="mt-3 flex justify-between text-sm text-gray-700">
              <div className="max-w-[300px] space-y-1">
                <p className="truncate">{ticketType.ticketTypeName}</p>
                <p className="text-gray-500">
                  {ticketType.price.toLocaleString()} VND
                </p>
              </div>
              <div className="text-right space-y-1">
                <p>{String(ticketType.quantity).padStart(2, '0')}</p>
                <p className="text-gray-500">
                  {(ticketType.price * ticketType.quantity).toLocaleString()}{' '}
                  VND
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-between items-center font-semibold">
          <span className="text-gray-700">Tạm tính {totalQuantity} vé</span>
          <span className="text-green-600">{total.toLocaleString()} VND</span>
        </div>

        <Button
          onClick={onContinue}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white text-base font-semibold rounded-lg flex items-center justify-center gap-2 py-6">
          Tiếp tục
          <ChevronRight size={18} />
        </Button>
      </CardContent>
    </Card>
  );
}
