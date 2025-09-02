import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RevenueChart from '@/components/revenue-chart';
import { Separator } from '@/components/ui/separator';

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
      <h2 className="font-semibold text-xl"> Tổng quan</h2>
      <Card className="bg-[#282629] text-white border-[#1f1d1f] mt-4">
        <CardContent className="space-y-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-4">
              <p className="text-sm">Doanh thu</p>
              <p className="text-xl font-bold">
                {summary.revenue.toLocaleString()}đ
              </p>
              <p className="text-gray-400">
                Tổng: {summary.revenueTotal.toLocaleString()}đ
              </p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#facc15"
                  strokeWidth="8"
                  fill="transparent"
                />

                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeDasharray={`${(revenuePercent / 100) *
                    2 *
                    Math.PI *
                    40} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-base">
                {revenuePercent}%
              </span>
            </div>
          </div>

          <Separator className="bg-gray-400 my-6" />

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-4">
              <p className="text-sm">Số lượng vé đã bán</p>
              <p className="text-xl font-bold">{summary.tickets} vé</p>
              <p className="text-gray-400">Tổng: {summary.ticketsTotal} vé</p>
            </div>
            <div className="relative w-24 h-24">
              {' '}
              {/* 👈 to hơn */}
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#facc15"
                  strokeWidth="8"
                  fill="transparent"
                />

                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeDasharray={`${(ticketsPercent / 100) *
                    2 *
                    Math.PI *
                    40} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-base">
                {ticketsPercent}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <div>
        <RevenueChart />
      </div>
    </div>
  );
}
