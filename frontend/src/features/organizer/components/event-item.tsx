import { ScanLine, Edit3, Trash2, MapPin, Calendar } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import QrScanner from './qr-scanner';
import { useState } from 'react';

export const mockEvents = [
  {
    id: '1',
    title: '[TP.HCM] Những Thành Phố Mơ Màng Year End 2024',
    location: 'TP.HCM',
    startDate: '08.12.2024 19:00',
    endDate: '08.12.2024 22:00',
    image: 'https://placehold.co/500x300/png?text=Event+1',
  },
  {
    id: '2',
    title: '[Nhà Hát THANH NIÊN] Hài kịch: Lạc lối ở Bangkok',
    location: 'Hà Nội',
    startDate: '15.11.2024 20:00',
    endDate: '15.11.2024 22:30',
    image: 'https://placehold.co/500x300/png?text=Event+2',
  },
  {
    id: '3',
    title: '1900 Future Hits #61: Quang Hùng MasterD',
    location: 'Hà Nội',
    startDate: '21.11.2024 21:00',
    endDate: '21.11.2024 23:00',
    image: 'https://placehold.co/500x300/png?text=Event+3',
  },
];

export type EventItemProps = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  image: string;
};

export default function EventItem({
  id,
  title,
  location,
  startDate,
  endDate,
  image,
}: EventItemProps) {
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <Card className="flex flex-col md:flex-row p-4 gap-4 bg-[#282629] text-white rounded-2xl shadow-md border border-[#1f1d1f]">
      {/* Ảnh sự kiện */}
      <div className="w-full md:w-48 aspect-video flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      <CardContent className="flex flex-col flex-1 p-2 justify-between">
        <div>
          <p className="font-semibold line-clamp-2 text-lg pb-2">{title}</p>

          {/* Thời gian */}
          <p className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
            <Calendar className="w-4 h-4" />
            {startDate} → {endDate}
          </p>

          {/* Địa chỉ */}
          <p className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin className="w-4 h-4 text-emerald-400" />
            {location}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer bg-transparent border border-emerald-500 hover:bg-emerald-600 hover:text-white transition w-full sm:w-auto">
                Quản lý
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-[#2A2A2D] text-white rounded-xl">
              <DropdownMenuItem onClick={() => alert(`Sửa sự kiện ${id}`)}>
                <Edit3 className="w-4 h-4 mr-2 " /> Sửa sự kiện
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 focus:text-red-500"
                onClick={() => alert(`Xóa sự kiện ${id}`)}>
                <Trash2 className="w-4 h-4 mr-2 text-red-400 focus:text-red-500" />{' '}
                Xóa sự kiện
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 cursor-pointer 
          w-full sm:w-auto justify-center sm:justify-start
          "
            onClick={() => setScannerOpen(true)}>
            <ScanLine className="w-4 h-4" />
            Quét vé
          </Button>

          <QrScanner
            open={scannerOpen}
            onClose={() => setScannerOpen(false)}
            onScan={data => console.log('Gửi server kiểm tra vé:', data)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
