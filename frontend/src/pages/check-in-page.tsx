import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Users, DoorOpen } from 'lucide-react';

type CheckinSummaryProps = {
  totalCheckedIn: number;
  totalSold: number;
  inside: number;
  outside: number;
};

type TicketTypeProps = {
  name: string;
  checkedIn: number;
  sold: number;
};

const CheckCircleChart = ({ percent }: { percent: number }) => {
  const data = [
    { name: 'checked', value: percent },
    { name: 'remaining', value: 100 - percent },
  ];

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={40}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="#111827" // viền tối (gray-900)
            strokeWidth={3}
          >
            <Cell fill="#10b981" />
            <Cell fill="#facc15" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center text-sm lg:text-base font-bold text-white">
        {percent}%
      </div>
    </div>
  );
};

const CheckinSummary = ({
  totalCheckedIn,
  totalSold,
  inside,
  outside,
}: CheckinSummaryProps) => {
  const percent = Math.round((totalCheckedIn / totalSold) * 100);

  return (
    <Card className="bg-[#282629] text-white border-[#1f1d1f]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Đã check-in</CardTitle>
        <div className="w-20 h-20">
          <CheckCircleChart percent={percent} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-emerald-400">
          {totalCheckedIn.toLocaleString()} vé
        </p>
        <p className="text-sm text-gray-400">
          Đã bán {totalSold.toLocaleString()}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between bg-[#31353e] rounded-lg p-3">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Trong sự kiện
            </span>
            <span>{inside.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between bg-[#31353e] rounded-lg p-3">
            <span className="flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-red-400" /> Đã ra ngoài
            </span>
            <span>{outside.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TicketTypeCard = ({ name, checkedIn, sold }: TicketTypeProps) => {
  const percent = Math.round((checkedIn / sold) * 100);

  return (
    <Card className="bg-[#282629] text-white border-[#1f1d1f]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{name}</CardTitle>
        <div className="size-20">
          <CheckCircleChart percent={percent} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-bold text-emerald-400">{checkedIn} vé</p>
        <p className="text-sm text-gray-400">Đã bán {sold}</p>
      </CardContent>
    </Card>
  );
};

export default function CheckinDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Tổng quan */}
        <CheckinSummary
          totalCheckedIn={1235}
          totalSold={2000}
          inside={1200}
          outside={35}
        />

        {/* Chi tiết vé */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Chi tiết hạng vé</h2>
          <TicketTypeCard name="Ticket Type 1" checkedIn={250} sold={280} />
          <TicketTypeCard name="Ticket Type 2" checkedIn={180} sold={200} />
        </div>
      </div>
    </div>
  );
}
