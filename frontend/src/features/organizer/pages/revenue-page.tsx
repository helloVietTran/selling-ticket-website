import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RevenueChart from '@/features/organizer/components/revenue-chart';
import CircleChart from '@/features/organizer/components/circle-chart';
import { ChartColumn, Menu } from 'lucide-react';
import EventDrawer from '../components/event-drawer';

type SummaryProps = {
  revenue: number;
  revenueTotal: number;
  tickets: number;
  ticketsTotal: number;
};

export default function RevenuePage() {
  const [summary] = useState<SummaryProps>({
    revenue: 500_000_000,
    revenueTotal: 600_000_000,
    tickets: 1235,
    ticketsTotal: 2000,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const revenuePercent = Math.round(
    (summary.revenue / summary.revenueTotal) * 100
  );
  const ticketsPercent = Math.round(
    (summary.tickets / summary.ticketsTotal) * 100
  );

  return (
    <>
      <div className='flex justify-between items-center'>
        <h2 className="font-semibold text-xl mb-4 flex gap-2 text-gray-300">
          <ChartColumn />
          Tổng quan
        </h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-md cursor-pointer"
          aria-label="Mở menu"
        >
          <Menu size={22} className="text-gray-300 hover:text-gray-400 transition-colors" />
        </button>

        <EventDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          eventId={1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card Doanh thu */}
        <Card className="bg-[#282629] text-white border-[#1f1d1f]">
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col gap-4">
              <span>Doanh thu</span>
              <p className="text-xl font-bold">
                {summary.revenue.toLocaleString()}đ
              </p>
              <p className="text-gray-400">
                Tổng: {summary.revenueTotal.toLocaleString()}đ
              </p>
            </div>
            <CircleChart
              percent={revenuePercent}
              size={96}
              colors={['#22c55e', '#facc15']}
              fontSize="1rem"
            />
          </CardContent>
        </Card>

        {/* Card Vé đã bán */}
        <Card className="bg-[#282629] text-white border-[#1f1d1f]">
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col gap-4">
              <span>Số lượng vé đã bán</span>
              <p className="text-xl font-bold">{summary.tickets} vé</p>
              <p className="text-gray-400">Tổng: {summary.ticketsTotal} vé</p>
            </div>
            <CircleChart
              percent={ticketsPercent}
              size={96}
              colors={['#3b82f6', '#e5e7eb']}
              fontSize="1rem"
            />
          </CardContent>
        </Card>
      </div>

      <RevenueChart />
    </>
  );
}
