import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';

type SummaryTicket = {
  id: string;
  name: string;
  count: number;
  subtotal: number;
};

type TicketSummaryProps = {
  tickets: SummaryTicket[];
  total: number;
  hasSelected: boolean;
  formatVND: (n: number) => string;
  onCheckout: () => void;
};

export default function TicketSummary({
  tickets,
  total,
  hasSelected,
  formatVND,
  onCheckout,
}: TicketSummaryProps) {
  return (
    <div className="space-y-4 sticky top-8">
      <Card className="bg-neutral-800 text-white rounded-xl overflow-hidden py-2">
        <CardContent className="p-4">
          <h4 className="text-base font-bold uppercase">
            [FLOWER 1969's] ROLLERBALL PERFUME WORKSHOP
          </h4>

          <div className="mt-4 flex items-center gap-3 text-neutral-200">
            <Calendar className="w-5 h-5" />
            <div className="text-sm">17:00, 13 tháng 9, 2025</div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-white">
                The Seat Cafe
              </div>
              <div className="text-xs text-neutral-300">
                Địa chỉ cụ thể, Quận X
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 text-white rounded-xl py-2">
        <CardContent className="p-4">
          <h5 className="text-lg font-semibold mb-3">Giá vé</h5>

          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.id} className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="text-sm">{t.name}</div>
                  <div className="text-xs text-neutral-400">
                    Số lượng: {t.count}
                  </div>
                </div>
                <div className="text-emerald-400 font-semibold">
                  {formatVND(t.subtotal)}
                </div>
              </div>
            ))}
          </div>

          <Button
            className={`w-full mt-6 py-6 text-lg rounded ${
              hasSelected
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-neutral-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!hasSelected}
            onClick={onCheckout}>
            {hasSelected ? (
              <div className="flex items-center justify-center gap-2">
                <span>Tiếp tục -</span>
                <span className="text-white">{formatVND(total)}</span>
                <span className="text-2xl">»</span>
              </div>
            ) : (
              'Vui lòng chọn vé'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
