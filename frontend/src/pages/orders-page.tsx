import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

type Order = {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkedIn: boolean;
};

const orders: Order[] = [
  {
    id: '123454',
    name: 'Hoàng Trung',
    email: 'h***05@gmail.com',
    phone: '+84353***166',
    checkedIn: true,
  },
  {
    id: '123455',
    name: 'Phong Nguyen',
    email: 'h***05@gmail.com',
    phone: '+84353***166',
    checkedIn: false,
  },
  {
    id: '123456',
    name: 'Thuat Nguyen',
    email: 'h***05@gmail.com',
    phone: '+84353***166',
    checkedIn: true,
  },
];

export default function OrdersPage() {
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

  return (
    <div>
      {/* Search */}
      <div className="mt-4">
        <Input
          placeholder="Search orders"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white text-black placeholder:text-gray-500 rounded"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          className={`rounded-full ${
            filter === 'all'
              ? 'bg-green-500 text-white'
              : 'bg-transparent text-gray-300 border-gray-600'
          }`}
          onClick={() => setFilter('all')}
        >
          Tất cả
        </Button>
        <Button
          variant="outline"
          className={`rounded-full ${
            filter === 'checked'
              ? 'bg-green-500 text-white'
              : 'bg-transparent text-gray-300 border-gray-600'
          }`}
          onClick={() => setFilter('checked')}
        >
          Đã checkin
        </Button>
        <Button
          variant="outline"
          className={`rounded-full ${
            filter === 'unchecked'
              ? 'bg-green-500 text-white'
              : 'bg-transparent text-gray-300 border-gray-600'
          }`}
          onClick={() => setFilter('unchecked')}
        >
          Chưa checkin
        </Button>
      </div>

      {/* Order list */}
      <p className="mt-4 text-sm text-gray-400">
        Có {filteredOrders.length} đơn hàng
      </p>

      <div className="mt-4 space-y-4">
        {filteredOrders.map(order => (
          <Card
            key={order.id}
            className="bg-[#1f1d1f] text-white border-none rounded-xl"
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">{order.name}</p>
                <span className="text-gray-400">&gt;</span>
              </div>
              <p className="text-sm">Mã đơn hàng: {order.id}</p>
              <div className="flex justify-between text-sm text-gray-400">
                <div>
                  <p>Email</p>
                  <p>{order.email}</p>
                </div>
                <div>
                  <p>Số điện thoại</p>
                  <p>{order.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
