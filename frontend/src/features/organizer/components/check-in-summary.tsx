import { UserMinus } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import CircleChart from './circle-chart';

type CheckinSummaryProps = {
  totalCheckedIn: number;
  totalSold: number;
  inside: number;
  outside: number;
};

const CheckinSummary = ({
  totalCheckedIn,
  totalSold,
  inside,
  outside,
}: CheckinSummaryProps) => {
  const percent =
    totalSold > 0 ? Math.round((totalCheckedIn / totalSold) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="relative bg-[#282629] text-white border-[#1f1d1f] h-full">
        <CardHeader>
          <CardTitle className="text-lg">Đã check-in</CardTitle>
          <div className="absolute top-4 right-4">
            <CircleChart
              percent={percent}
              size={100}
              colors={['#10b981', '#facc15']}
              fontSize="0.875rem"
            />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <span className="text-2xl font-semibold text-emerald-400 pr-4">
            {totalCheckedIn.toLocaleString()} vé
          </span>
          <span className="text-sm text-gray-400">
            Đã bán {totalSold.toLocaleString()}
          </span>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 h-full">
        <Card className="bg-[#282629] text-white border-[#1f1d1f] flex flex-row justify-between items-center p-4 flex-1">
          <span className="flex items-center gap-4">
            <UserMinus className="size-5 text-emerald-400" /> Trong sự kiện
          </span>
          <span>{inside.toLocaleString()}</span>
        </Card>

        <Card className="bg-[#282629] text-white border-[#1f1d1f] flex flex-row justify-between items-center p-4 flex-1">
          <span className="flex items-center gap-4">
            <UserMinus className="size-5 text-red-400" /> Đã ra ngoài
          </span>
          <span>{outside.toLocaleString()}</span>
        </Card>
      </div>
    </div>
  );
};

export default CheckinSummary;
