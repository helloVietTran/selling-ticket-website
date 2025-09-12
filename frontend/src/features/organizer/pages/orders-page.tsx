import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Order = {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkedIn: boolean;
};

const orders: Order[] = [
  {
    id: 'DH123454',
    name: 'Hoàng Trung',
    email: 'h***05@gmail.com',
    phone: '+84353***166',
    checkedIn: true,
  },
  {
    id: 'DH123455',
    name: 'Phong Nguyen',
    email: 'p***nguyen@gmail.com',
    phone: '+84353***177',
    checkedIn: false,
  },
  {
    id: 'DH123456',
    name: 'Thuat Nguyen',
    email: 't***nguyen@gmail.com',
    phone: '+84353***199',
    checkedIn: true,
  },
];

export default function OrdersTable() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'checked' | 'unchecked'>('all');

  const filteredOrders = orders.filter(order => {
    const matchSearch =
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      order.id.includes(search);

    const matchFilter =
      filter === 'all'
        ? true
        : filter === 'checked'
        ? order.checkedIn
        : !order.checkedIn;

    return matchSearch && matchFilter;
  });

  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'checked', label: 'Đã check-in' },
    { key: 'unchecked', label: 'Chưa check-in' },
  ] as const;

  return (
    <div className="text-white">
      <h1 className="mb-4 font-semibold">Đơn hàng</h1>
      <Input
        placeholder="Tìm kiếm đơn hàng..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bg-white text-[#333] placeholder:text-gray-500 rounded"
      />

      <div className="flex gap-2 mt-4">
        {filters.map(f => (
          <Button
            key={f.key}
            variant="outline"
            className={`rounded-full cursor-pointer ${
              filter === f.key
                ? 'bg-emerald-500 text-white'
                : 'bg-transparent text-gray-300 border-gray-600'
            }`}
            onClick={() => setFilter(f.key)}>
            {f.label}
          </Button>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-40 mb-4">
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
              <TableHead className="text-white px-4 py-2">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <TableRow
                  key={order.id}
                  className="bg-[#2c2f35] border-b border-[#1f1d1f] hover:bg-[#383c44]">
                  <TableCell className="px-4 py-2">{order.id}</TableCell>
                  <TableCell className="px-4 py-2">{order.name}</TableCell>
                  <TableCell className="px-4 py-2">{order.email}</TableCell>
                  <TableCell className="px-4 py-2">{order.phone}</TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge
                      className={
                        order.checkedIn
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-500 text-white'
                      }>
                      {order.checkedIn ? 'Đã check-in' : 'Chưa check-in'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
                      Hoàn tiền
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-400">
                  Không có đơn hàng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
