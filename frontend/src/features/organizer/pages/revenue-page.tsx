import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RevenueChart from '@/features/organizer/components/revenue-chart';
import { Separator } from '@/components/ui/separator';
import CircleChart from '@/features/organizer/components/circle-chart';

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

  const revenuePercent = Math.round(
    (summary.revenue / summary.revenueTotal) * 100
  );
  const ticketsPercent = Math.round(
    (summary.tickets / summary.ticketsTotal) * 100
  );

  return (
    <div>
      <h2 className="font-semibold text-xl pb-2">Tổng quan</h2>
      <Card className="bg-[#282629] text-white border-[#1f1d1f] mt-4">
        <CardContent className="space-y-10">
          {/* Doanh thu */}
          <div className="flex justify-between items-center">
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
          </div>

          <Separator className="bg-gray-400 my-6" />

          {/* Vé đã bán */}
          <div className="flex justify-between items-center">
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
          </div>
        </CardContent>
      </Card>

      <RevenueChart />
    </div>
  );
}
