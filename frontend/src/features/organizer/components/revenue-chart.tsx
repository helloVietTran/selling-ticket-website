import { Card, CardContent } from '@/components/ui/card';
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

const data: ChartData[] = [
  { date: '20Th10', tickets: 200, revenue: 200000000 },
  { date: '21Th10', tickets: 300, revenue: 150000000 },
  { date: '22Th10', tickets: 400, revenue: 250000000 },
  { date: '23Th10', tickets: 500, revenue: 400000000 },
  { date: '24Th10', tickets: 700, revenue: 500000000 },
  { date: '25Th10', tickets: 450, revenue: 300000000 },
  { date: '26Th10', tickets: 200, revenue: 100000000 },
];

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
              {new Intl.NumberFormat('vi-VN').format(Number(revenue.value))}đ
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
  return (
    <Card className="w-full bg-transparent border-none text-white">
      <div className="flex gap-2 p-2">
        <button className="px-3 py-1 rounded-full bg-emerald-500 text-sm cursor-pointer">
          1 tuần
        </button>
        <button className="px-3 py-1 rounded-full bg-gray-700 text-sm cursor-pointer">
          24 giờ
        </button>
      </div>

      <CardContent className="h-[400px] px-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
              tickFormatter={value => `${(value / 1000000).toFixed(0)}M`}
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
              activeBar={false}
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
