import { Button } from '@/components/ui/button';
import { Trash2, Ticket } from 'lucide-react';

type TicketTypeItemProps = {
  name: string;
  onRemove: () => void;
};

export default function TicketTypeItem({
  name,
  onRemove,
}: TicketTypeItemProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-[#3d424f] p-3">
      <div className="flex items-center gap-3 text-white">
        <Ticket className="h-4 w-4" />
        <span className="truncate">{name}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={onRemove}
          className="bg-red-500 hover:bg-red-400 text-white size-8 cursor-pointer hover:text-white">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
