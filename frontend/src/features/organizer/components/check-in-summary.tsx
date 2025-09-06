import { FaUserMinus } from 'react-icons/fa6';
import { FaUserPlus } from 'react-icons/fa';

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
  const percent = Math.round((totalCheckedIn / totalSold) * 100);

  return (
    <Card className="relative bg-[#282629] text-white border-[#1f1d1f]">
      <CardHeader>
        <CardTitle className="text-lg">Đã check-in</CardTitle>
        <div className="absolute top-4 right-4">
          <CircleChart
            percent={percent}
            size={100}
            colors={['#10b981', '#facc15']}
            fontSize="0.875rem" // text-sm
          />
        </div>
      </CardHeader>

      <CardContent>
        <span className="text-2xl font-semibold text-emerald-400 pr-4">
          {totalCheckedIn.toLocaleString()} vé
        </span>
        <span className="text-sm text-gray-400">
          Đã bán {totalSold.toLocaleString()}
        </span>

        <div className="mt-6 space-y-2.5">
          <div className="flex items-center justify-between bg-[#31353e] rounded-lg p-4">
            <span className="flex items-center gap-4">
              <FaUserPlus className="size-5 text-emerald-400" /> Trong sự kiện
            </span>
            <span>{inside.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between bg-[#31353e] rounded-lg p-4">
            <span className="flex items-center gap-4">
              <FaUserMinus className="size-5 text-red-400" /> Đã ra ngoài
            </span>
            <span>{outside.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckinSummary;
