import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle } from 'lucide-react';

import type { StatsTicketType } from '@/types';
import { useApi } from '@/api/hooks/useApi';
import { statsTicketType } from '@/api/ticketTypeApi';
import { useParams } from 'react-router-dom';

const CheckinTable = () => {

  const { eventId } = useParams<{ eventId: string }>();
  const {
    data: statsData,
    apiStatus,
    exec: fetchStats,
  } = useApi(statsTicketType);

  useEffect(() => {
    if (eventId) {
      fetchStats(eventId);
    }
  }, [eventId, fetchStats]);

  if (apiStatus === 'PENDING') {
    return (
      <div className="flex justify-center items-center h-48 bg-[#282629] border border-[#1f1d1f] rounded-lg text-white">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Đang tải thống kê...</span>
      </div>
    );
  }

  if (apiStatus === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-48 bg-[#282629] border border-[#1f1d1f] rounded-lg text-red-400">
        <AlertCircle className="mr-2 h-6 w-6" />
        <span>Không thể tải dữ liệu. Vui lòng thử lại.</span>
      </div>
    );
  }

  if (!statsData?.data || statsData.data.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 bg-[#282629] border border-[#1f1d1f] rounded-lg text-white">
        <span>Chưa có dữ liệu thống kê check-in.</span>
      </div>
    );
  }


  const tickets: StatsTicketType[] = statsData.data;

  return (
    <div className="bg-[#282629] border border-[#1f1d1f] rounded-lg overflow-hidden text-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#31353e] hover:bg-[#31353e]">
            <TableHead className="text-white px-4 py-2">Loại vé</TableHead>
            <TableHead className="text-white px-4 py-2">Giá bán</TableHead>
            <TableHead className="text-white px-4 py-2">Đã check-in</TableHead>
            <TableHead className="text-white px-4 py-2">
              Tỉ lệ check-in
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {tickets.map((ticket) => {
            const percent =
              ticket.sold > 0
                ? Math.round((ticket.checkedIn / ticket.sold) * 100)
                : 0;

            return (
              <TableRow
                key={ticket.type}
                className="bg-[#2c2f35] border-b border-[#1f1d1f] hover:bg-[#383c44]">
                <TableCell className="px-4 py-2">{ticket.type}</TableCell>
                <TableCell className="px-4 py-2">
                  {ticket.price.toLocaleString()}đ
                </TableCell>
                <TableCell className="px-4 py-2">
                  {ticket.checkedIn} / {ticket.sold}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex flex-row-reverse items-center gap-2">
                    <Progress
                      value={percent}
                      className="h-2 w-full bg-gray-600 [&>div]:bg-green-500"
                    />
                    <span className="whitespace-nowrap">{percent}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CheckinTable;