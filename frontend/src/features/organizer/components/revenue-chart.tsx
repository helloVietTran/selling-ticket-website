import { useApi } from '@/api/hooks/useApi';
import { getWeeklyRevenue } from '@/api/revenueApi';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
} from 'recharts';

type ChartData = {
  date: string;
  tickets: number;
  revenue: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const revenue = payload.find((p: any) => p.dataKey === 'revenue');
    const tickets = payload.find((p: any) => p.dataKey === 'tickets');

    return (
      <div className="bg-[#1f1d1f] border border-gray-700 rounded-lg p-3 shadow-md">
        <p className="text-sm text-gray-400 mb-2">{label}</p>

        {revenue && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-sm text-gray-200">Doanh thu:</span>
            <span className="font-semibold text-purple-400">
              {new Intl.NumberFormat('vi-VN').format(Number(revenue.value))} VND
            </span>
          </div>
        )}

        {tickets && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-gray-200">Vé bán:</span>
            <span className="font-semibold text-white">{tickets.value} vé</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const { eventId } = useParams();
  const { data: weeklyRevenueData, exec: fetchWeeklyRevenue } = useApi(
    getWeeklyRevenue
  );

  useEffect(() => {
    if (eventId) {
      fetchWeeklyRevenue(eventId);
    }
  }, [eventId]);

  const chartData: ChartData[] = useMemo(() => {
    if (!weeklyRevenueData?.data?.dailyRevenue) return [];

    return weeklyRevenueData.data.dailyRevenue.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      }),
      tickets: item.ticketsSold,
      revenue: item.revenue,
    }));
  }, [weeklyRevenueData]);

  const totalRevenue = weeklyRevenueData?.data?.totalRevenue ?? 0;
  const totalTickets = weeklyRevenueData?.data?.totalTicketsSold ?? 0;

  const maxRevenue = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(item => item.revenue));
  }, [chartData]);

  const formatRevenue = (value: number) => {
    if (maxRevenue < 1_000_000) return `${(value / 1_000).toFixed(0)}K`;
    if (maxRevenue < 1_000_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  };

  return (
    <Card className="w-full bg-transparent border-none text-white">
      <div className="flex items-center justify-between gap-2 p-2">
        <button className="px-3 py-1 rounded-full bg-emerald-500 text-sm cursor-pointer">
          1 tuần gần đây
        </button>

        <div className="flex items-center gap-6 text-sm text-gray-300">
          <span>
            Tổng vé bán:{' '}
            <span className="font-semibold text-emerald-400">
              {totalTickets}
            </span>
          </span>
          <span>
            Tổng doanh thu:{' '}
            <span className="font-semibold text-purple-400">
              {new Intl.NumberFormat('vi-VN').format(totalRevenue)} VND
            </span>
          </span>
        </div>
      </div>

      <CardContent className="h-[400px] px-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#444"
              vertical={false}
            />

            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis
              yAxisId="left"
              stroke="#16a34a"
              tickFormatter={value => `${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9333ea"
              tickFormatter={formatRevenue}
              domain={[0, maxRevenue * 1.1]} // tự scale đẹp mắt
            />

            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={<CustomTooltip />}
            />

            <Bar
              yAxisId="left"
              dataKey="tickets"
              fill="url(#colorTickets)"
              radius={[4, 4, 0, 0]}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#9333ea"
              strokeWidth={2}
              dot={{ r: 4, fill: '#9333ea' }}
              activeDot={{ r: 6 }}
            />

            <defs>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.9} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
