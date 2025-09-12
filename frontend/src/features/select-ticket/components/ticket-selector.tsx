import { useMemo, useState } from 'react';
import TicketItem from './ticket-item';
import TicketSummary from './ticket-summary';

const MOCK_TICKETS = [
  { id: 'standard', name: 'Vé Thường (Workshop Nước Hoa Lăn)', price: 310000 },
  {
    id: 'discount',
    name: '(Vé Ưu Đãi) Workshop Nước Hoa Lăn',
    price: 279000,
    description: 'Vé ưu đãi giảm 10% dành cho nhóm khách đăng ký trên 4 slot',
  },
];

const formatVND = (n: number) =>
  n.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' đ';

export default function TicketSelector() {
  const [qty, setQty] = useState<Record<string, number>>({
    standard: 0,
    discount: 0,
  });

  const changeQty = (id: string, delta: number) =>
    setQty(prev => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });

  const subtotalPerTicket = useMemo(
    () =>
      MOCK_TICKETS.map(t => ({
        ...t,
        count: qty[t.id] || 0,
        subtotal: (qty[t.id] || 0) * t.price,
      })),
    [qty]
  );

  const total = subtotalPerTicket.reduce((s, t) => s + t.subtotal, 0);
  const hasSelected = total > 0;

  const handleCheckout = () => {
    if (!hasSelected) return;
    alert(`Bạn đã chọn ${formatVND(total)} — tiến hành thanh toán`);
  };

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT */}
        <div className="flex-1">
          <h3 className="text-center text-emerald-400 font-semibold text-xl mb-6">
            Chọn vé
          </h3>
          <div className="bg-black text-white rounded-2xl p-6">
            <div className="flex justify-between ">
              <div className="text-white font-semibold">Loại vé</div>
              <div className="hidden lg:block text-center text-white font-semibold">
                Số lượng
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {subtotalPerTicket.map(t => (
                <TicketItem
                  key={t.id}
                  id={t.id}
                  name={t.name}
                  price={t.price}
                  count={t.count}
                  onChange={changeQty}
                  formatVND={formatVND}
                />
              ))}
              <div className="border-t border-dashed border-neutral-700 pt-6" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="w-full lg:w-96">
          <TicketSummary
            tickets={subtotalPerTicket}
            total={total}
            hasSelected={hasSelected}
            formatVND={formatVND}
            onCheckout={handleCheckout}
          />
        </aside>
      </div>
    </div>
  );
}
