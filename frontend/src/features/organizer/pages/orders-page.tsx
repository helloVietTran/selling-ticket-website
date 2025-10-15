import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/api/hooks/useApi';
import { useParams } from 'react-router-dom';

import { getPaidBookingsByEventId } from '@/api/bookingApi';
import SectionHeader from '../components/section-header';
import { ShoppingCart } from 'lucide-react';

export default function OrdersTable() {
  const [search, setSearch] = useState('');
  const { eventId } = useParams();
  const { exec, data, error } = useApi(getPaidBookingsByEventId);

  useEffect(() => {
    if (eventId) exec(eventId);
    if (error) {
      console.log(error);
    }
  }, [eventId]);

  const orders = data?.data || [];

  const filteredOrders = orders.filter((order: any) => {
    const searchText = search.toLowerCase();
    return (
      order.attendee?.userName?.toLowerCase().includes(searchText) ||
      order.attendee?.email?.toLowerCase().includes(searchText) ||
      order.bookingId?.toString().includes(searchText)
    );
  });

  return (
    <>
      <SectionHeader
        title="Đơn hàng"
        eventId={eventId || ''}
        icon={ShoppingCart}
      />

      <Input
        placeholder="Tìm kiếm đơn hàng..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bg-white text-[#333] placeholder:text-gray-500 rounded"
      />

      <p className="mt-4 text-sm text-gray-400 mb-4">
        Có {filteredOrders.length} đơn hàng
      </p>

      <div className="mt-4 bg-[#1f1d1f] border border-[#2c2c2c] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#31353e] hover:bg-[#31353e]">
              <TableHead className="text-white px-4 py-2">
                Mã đơn hàng
              </TableHead>
              <TableHead className="text-white px-4 py-2">Người mua</TableHead>
              <TableHead className="text-white px-4 py-2">Email</TableHead>
              <TableHead className="text-white px-4 py-2">
                Số điện thoại
              </TableHead>
              <TableHead className="text-white px-4 py-2">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order: any) => (
                <TableRow
                  key={order.bookingId}
                  className="bg-[#2c2f35] border-b border-[#1f1d1f] hover:bg-[#383c44]">
                  <TableCell className="px-4 py-2">{order.bookingId}</TableCell>
                  <TableCell className="px-4 py-2">
                    {order.attendee?.userName}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {order.attendee?.email}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {order.attendee?.phoneNumber || '—'}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="bg-emerald-500 text-white">
                      Đã thanh toán
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-400">
                  Không có đơn hàng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
