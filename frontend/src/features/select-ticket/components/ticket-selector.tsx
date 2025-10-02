import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getTicketTypesByEventId } from '@/api/ticketTypeApi';
import { useApi } from '@/api/hooks/useApi';
import TicketItem from './ticket-item';
import TicketSummary from './ticket-summary';
import type { TicketType } from '@/types';

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
  const { eventId } = useParams<{ eventId: string }>();
  const [qty, setQty] = useState<Record<number, number>>({});

  const {
    data,
    exec,
  } = useApi(getTicketTypesByEventId);

  useEffect(() => {
    if (eventId) {
      exec(eventId);
    }
  }, [eventId]);

  const ticketTypes = data?.data || [];

  useEffect(() => {
    if (!ticketTypes || ticketTypes.length === 0) return;
    setQty(prev => {
      const next = { ...prev };
      ticketTypes.forEach((t: TicketType) => {
        const id = t.ticketTypeId;

        if (typeof next[id] === 'undefined') {
          next[id] = t.minPerUser
        }
      });
      return next;
    });
  }, [ticketTypes]);


  const ticketMap = useMemo(() => {
    const map: Record<number, TicketType> = {};
    (ticketTypes || []).forEach((t: TicketType) => (map[t.ticketTypeId] = t));
    return map;
  }, [ticketTypes]);


  const changeQty = (id: number, delta: number) =>
    setQty(prev => {
      const t = ticketMap[id];
      const min = t ? t.minPerUser : 0;
      const max = t ? t.maxPerUser : Infinity;
      const current = prev[id] ?? min;
      const nextVal = Math.min(max, Math.max(min, current + delta));
      return { ...prev, [id]: nextVal };
    });


  const uiTickets = useMemo(() => {
    return (ticketTypes || []).map((t: TicketType) => ({
      id: t.ticketTypeId,
      name: t.ticketTypeName,
      price: t.price,
      description: t.description,
      minPerUser: t.minPerUser,
      maxPerUser: t.maxPerUser,
      count: qty[t.ticketTypeId] ?? (t.minPerUser > 0 ? t.minPerUser : 0),
      subtotal: (qty[t.ticketTypeId] ?? (t.minPerUser > 0 ? t.minPerUser : 0)) * t.price,
    }));
  }, [ticketTypes, qty]);


  const total = uiTickets.reduce((s, t) => s + t.subtotal, 0);
  const hasSelected = total > 0;


  const handleCheckout = () => {
    const selected = uiTickets
      .filter(t => t.count > 0)
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
              {uiTickets.map(t => (
                <TicketItem
                  key={t.id}
                  id={t.id}
                  name={t.name}
                  price={t.price}
                  count={t.count}
                  min={t.minPerUser}
                  max={t.maxPerUser}
                  onChange={changeQty}
                  formatVND={formatVND}
                />
              ))}
              <div className="border-t border-dashed border-neutral-700 pt-6" />
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-96">
          <TicketSummary
            tickets={uiTickets}
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
