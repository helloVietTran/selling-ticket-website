import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Order = {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkedIn: boolean;
  avatar: string;
};

const orders: Order[] = [
  {
    id: '123454',
    name: 'Hoàng Trung',
    email: 'h***05@gmail.com',
    phone: '+84353***166',
    checkedIn: true,
    avatar: 'https://i.pravatar.cc/100?u=123454',
  },
  {
    id: '123455',
    name: 'Phong Nguyen',
    email: 'h***05@gmail.com',
    phone: '+84353***166',
    checkedIn: false,
    avatar: 'https://i.pravatar.cc/100?u=123455',
  },
  {
    id: '123456',
    name: 'Thuat Nguyen',
    email: 'h***05@gmail.com',
    phone: '+84353***166',
    checkedIn: true,
    avatar: 'https://i.pravatar.cc/100?u=123456',
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

  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'checked', label: 'Đã checkin' },
    { key: 'unchecked', label: 'Chưa checkin' },
  ] as const;

  return (
    <div>
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
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-400">
        Có {filteredOrders.length} đơn hàng
      </p>

      <div className="mt-4 space-y-4">
        {filteredOrders.map(order => (
          <Card
            key={order.id}
            className="bg-[#1f1d1f] text-white border-none rounded-xl p-2"
          >
            <CardContent className="py-2 px-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={order.avatar}
                    alt={order.name}
                    className="size-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-sm text-gray-200">
                      {order.name}
                    </p>
                    <span className="text-sm text-gray-400">
                      Mã đơn hàng: {order.id}
                    </span>
                  </div>
                </div>

                <Badge
                  className={
                    order.checkedIn
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-500 text-white'
                  }
                >
                  {order.checkedIn ? 'Đã check-in' : 'Chưa check-in'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-gray-300 text-xs pt-2">
                <div className="flex gap-2">
                  <span className="text-gray-400">Email:</span>
                  <span>{order.email}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400">Số điện thoại:</span>
                  <span>{order.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
