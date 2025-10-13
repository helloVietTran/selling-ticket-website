import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/formatVND";

type TicketItemProps = {
  id: number;
  name: string;
  price: number;
  count: number;
  min: number;
  max: number;
  onChange: (id: number, delta: number) => void;
};

export default function TicketItem({
  id,
  name,
  price,
  count,
  min,
  max,
  onChange,
}: TicketItemProps) {
  const handleDecrease = () => onChange(id, -1);
  const handleIncrease = () => onChange(id, 1);

  const isMinDisabled = count <= min;
  const isMaxDisabled = count >= max;

  return (
    <div className="border-t border-dashed border-neutral-700 pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,160px] items-center gap-4">
        <div>
          <p className="text-emerald-400 font-semibold">{name}</p>
          <p className="text-sm text-gray-300 mt-2">{formatVND(price)}</p>

          <div className="mt-2 text-sm text-gray-300">
            {min > 0 && `Tối thiểu: ${min}`}
            {min > 0 && max < Infinity && <span className="mx-1">•</span>}
            {max < Infinity && `Tối đa: ${max}`}
          </div>

          <div className="flex justify-center lg:justify-end mt-3">
            <div className="flex items-center gap-2">

              <Button
                variant="secondary"
                size="icon"
                onClick={handleDecrease}
                aria-label={`Giảm ${name}`}
                disabled={isMinDisabled}
                className={`w-10 h-10 rounded-md shadow-sm 
                  ${isMinDisabled ? "cursor-not-allowed opacity-50" : ""}
                `}
              >
                −
              </Button>


              <div className="w-12 h-10 grid place-items-center bg-neutral-900 border border-neutral-700 rounded-md text-white">
                {count}
              </div>


              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrease}
                aria-label={`Tăng ${name}`}
                disabled={isMaxDisabled}
                className={`w-10 h-10 rounded-md border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 
                  ${isMaxDisabled ? "cursor-not-allowed opacity-50" : ""}
                `}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
