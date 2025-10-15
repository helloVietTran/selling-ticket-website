import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProvinces, getDistricts, getWards } from 'sub-vn';
import { toast } from 'sonner';

import { bookingTicketType, getTicketTypesByEventId } from '@/api/ticketTypeApi';
import { useApi } from '@/api/hooks/useApi';
import type { SelectTicketTypePayload, TicketType } from '@/types';
import { getEventById } from '@/api/eventApi';
import { formatDateTime } from '@/lib/formatDateTime';
import TicketItem from './ticket-item';
import TicketSummary from './ticket-summary';

export default function TicketSelector() {
  const { eventId } = useParams<{ eventId: string }>();
  const [qty, setQty] = useState<Record<number, number>>({});
  const navigate = useNavigate();

  const {
    data: ticketTypeData,
    exec: fetchTicketTypes,
  } = useApi(getTicketTypesByEventId);

  const { data: eventData, exec: fetchEvent } = useApi(getEventById);
  const { data: bookingData, exec: createBooking, isError, isSuccess } = useApi(bookingTicketType);

  // fetch data
  useEffect(() => {
    if (eventId) {
      fetchTicketTypes(eventId);
      fetchEvent(eventId);
    }
  }, [eventId]);

  const ticketTypes = ticketTypeData?.data || [];
  const event = eventData?.data;

  const provinces = getProvinces();
  const districts = getDistricts();
  const wards = getWards();

  // initialize qty state based on ticket types
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

  useEffect(() => {
    if (isSuccess) {
      toast.success("Đặt trước vé thành công!");
      navigate(`/events/${eventId}/booking/${bookingData?.data?.bookingId}`);
    } else if (isError) {
      toast.error("Loại vé này không còn khả dụng");
    }
  }, [isError, isSuccess])


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

  const handleCheckout = async () => {
    if(!eventId){
      return;
    }
    //format payload for api
    const selected: SelectTicketTypePayload = {
      ticketTypes: uiTickets
        .filter(t => t.count > 0)
        .map(t => ({
          ticketTypeId: String(t.id),
          quantity: t.count,
        })),
      eventId: eventId
    };
    await createBooking(selected);

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

                />
              ))}
              <div className="border-t border-dashed border-neutral-700 pt-6" />
            </div>
          </div>
        </div>

        {event && (
          <aside className="w-full lg:w-96">
            <TicketSummary
              tickets={uiTickets}
              total={total}
              hasSelected={hasSelected}
              onCheckout={handleCheckout}
              eventName={event.title}
              startTime={formatDateTime(event.startTime)}
              province={
                provinces.find((p: any) => p.code === event.venue.province)?.name
              }
              detailAddress={
                `${event.venue.street}, ` +
                `${wards.find((w: any) => w.code === event.venue.ward)?.name}, ` +
                `${districts.find((d: any) => d.code === event.venue.district)?.name}, `
              }
            />
          </aside>
        )}
      </div>
    </div>
  );
}
