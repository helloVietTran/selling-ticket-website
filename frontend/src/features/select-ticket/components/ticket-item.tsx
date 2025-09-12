// components/TicketItem.tsx

type TicketItemProps = {
  id: string;
  name: string;
  price: number;
  count: number;
  onChange: (id: string, delta: number) => void;
  formatVND: (n: number) => string;
};

export default function TicketItem({
  id,
  name,
  price,
  count,
  onChange,
  formatVND,
}: TicketItemProps) {
  return (
    <div className="border-t border-dashed border-neutral-700 pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,160px] items-center gap-4">
        <div>
          <p className="text-emerald-400 font-semibold">{name}</p>
          <p className="text-sm text-neutral-300 mt-2">{formatVND(price)}</p>

          <div className="flex justify-center lg:justify-end">
            <div className="flex items-center gap-2">
              <button
                aria-label={`Giảm ${name}`}
                onClick={() => onChange(id, -1)}
                className="w-10 h-10 rounded-md bg-neutral-100 text-black grid place-items-center shadow-sm hover:opacity-90">
                −
              </button>

              <div className="w-12 h-10 grid place-items-center bg-neutral-900 border border-neutral-700 rounded-md text-white">
                {count}
              </div>

              <button
                aria-label={`Tăng ${name}`}
                onClick={() => onChange(id, 1)}
                className="w-10 h-10 rounded-md bg-transparent border-2 border-emerald-500 text-emerald-400 grid place-items-center hover:bg-emerald-500/10">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
