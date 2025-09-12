import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

type TicketDetail = {
  type: string;
  price: number;
  checkedIn: number;
  sold: number;
};

const fakeData: TicketDetail[] = [
  { type: '1234', price: 0, checkedIn: 0, sold: 0 },
  { type: 'VIP', price: 500000, checkedIn: 20, sold: 100 },
  { type: 'Standard', price: 200000, checkedIn: 50, sold: 200 },
];

const CheckinTable = () => {
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
          {fakeData.map((ticket, index) => {
            const percent =
              ticket.sold > 0
                ? Math.round((ticket.checkedIn / ticket.sold) * 100)
                : 0;

            return (
              <TableRow
                key={index}
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
