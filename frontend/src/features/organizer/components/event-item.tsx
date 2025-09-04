import { ScanLine, Edit3, Trash2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const mockEvents = [
  {
    id: '1',
    title: '[TP.HCM] Những Thành Phố Mơ Màng Year End 2024',
    location: 'TP.HCM',
    date: '08.12.2024',
    image: 'https://placehold.co/300x300/png?text=Event+1',
  },
  {
    id: '2',
    title: '[Nhà Hát THANH NIÊN] Hài kịch: Lạc lối ở Bangkok',
    location: 'Hà Nội',
    date: '15.11.2024',
    image: 'https://placehold.co/300x300/png?text=Event+2',
  },
  {
    id: '3',
    title: '1900 Future Hits #61: Quang Hùng MasterD',
    location: 'Hà Nội',
    date: '21.11.2024',
    image: 'https://placehold.co/300x300/png?text=Event+2',
  },
];

type EventItemProps = {
  id: string;
  title: string;
  location: string;
  date: string;
  image: string;
};

export default function EventItem({
  id,
  title,
  location,
  date,
  image,
}: EventItemProps) {
  return (
    <Card className="flex flex-row p-4 gap-3 bg-[#282629] text-white rounded-2xl shadow-md border border-[#1f1d1f]">
      <div className="w-32 h-32 flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      <CardContent className="flex flex-col flex-1 p-2 justify-between">
        <div>
          <p className="font-semibold line-clamp-2 pb-2">{title}</p>
          <p className="text-xs text-gray-400">
            {location} | {date}
          </p>
        </div>

        <div className="flex gap-2 mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer bg-transparent border border-emerald-500 hover:bg-emerald-600 hover:text-white transition"
              >
                Quản lý
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-[#2A2A2D] text-white rounded-xl"
            >
              <DropdownMenuItem onClick={() => alert(`Sửa sự kiện ${id}`)}>
                <Edit3 className="w-4 h-4 mr-2 " /> Sửa sự kiện
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 focus:text-red-500"
                onClick={() => alert(`Xóa sự kiện ${id}`)}
              >
                <Trash2 className="size-4 mr-2 text-red-400 focus:text-red-500" />{' '}
                Xóa sự kiện
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 cursor-pointer">
            <ScanLine className="w-4 h-4" />
            Quét vé
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
