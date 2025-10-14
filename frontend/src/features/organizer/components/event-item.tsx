import { useState } from 'react';
import { ScanLine, Trash2, MapPin, Calendar, DollarSign, ShoppingCart, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

import QrScanner from './qr-scanner';
import { deleteEvent } from '@/api/eventApi';
import { useApi } from '@/api/hooks/useApi';
import { EventStatus, LOCAL_STORAGE_KEYS } from '@/constant';
import { Link } from 'react-router-dom';

export type EventItemProps = {
  eventId: number;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  image?: string;
  eventStatus: EventStatus;
};

export default function EventItem({
  eventId,
  title,
  location,
  startDate,
  endDate,
  image,
  eventStatus
}: EventItemProps) {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { exec: deleteEventExec } = useApi(deleteEvent);

  const handleDelete = async () => {
    const organizerId = localStorage.getItem(LOCAL_STORAGE_KEYS.ORGANIZER_ID);
    if (!organizerId) return;
    try {

      await deleteEventExec(eventId, organizerId);
      toast.success('Xóa sự kiện thành công');

    } catch (err) {
      toast.error('Xóa sự kiện thất bại! Vui lòng thử lại sau');
      console.error(err);
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <Card className="flex flex-col md:flex-row p-4 gap-4 bg-[#282629] text-white rounded-2xl shadow-md border border-[#1f1d1f]">
      <div className="w-full md:w-48 aspect-video flex-shrink-0">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Avatar className="w-full h-full bg-[#3a393c] text-4xl font-semibold text-gray-300 flex items-center justify-center">
            <AvatarImage
              src={image || undefined}
              alt={title}
              className="object-cover w-full h-full"
            />
            <AvatarFallback>{title?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <CardContent className="flex flex-col flex-1 p-2 justify-between">
        <div>
          <p className="font-semibold line-clamp-2 text-lg pb-2">{title}</p>
          <p className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
            <Calendar className="w-4 h-4" />
            {startDate} → {endDate}
          </p>
          <p className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin className="w-4 h-4 text-emerald-400" />
            {location}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer bg-transparent border border-emerald-500 hover:bg-emerald-600 hover:text-white transition w-full sm:w-auto">
                Quản lý
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-[#2A2A2D] text-white rounded-xl">
              <DropdownMenuItem
                className="text-red-500 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                onClick={() => setConfirmOpen(true)}
              >
                <div className="flex items-center gap-4">
                  <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                  <span>Xóa sự kiện</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="text-yellow-600 hover:bg-yellow-50 focus:bg-yellow-50">
                <Link
                  className="flex items-center gap-4 w-full"
                  to={`/organizer/revenue/events/${eventId}`}
                >
                  <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>Doanh thu</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="text-emerald-600 hover:bg-emerald-50 focus:bg-emerald-50">
                <Link
                  className="flex items-center gap-4 w-full"
                  to={`/organizer/check-in/events/${eventId}`}
                >
                  <CheckSquare className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>Check-in</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="text-neutral-400 hover:bg-gray-10 focus:bg-gray-100">
                <Link
                  className="flex items-center gap-4 w-full"
                  to={`/organizer/orders/events/${eventId}`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2 text-neutral-400" />
                  <span>Đơn hàng</span>
                </Link>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

          {eventStatus === EventStatus.ONGOING && (
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 cursor-pointer 
              w-full sm:w-auto justify-center sm:justify-start"
              onClick={() => setScannerOpen(true)}>
              <ScanLine className="w-4 h-4" />
              Quét vé
            </Button>
          )}


          <QrScanner
            open={scannerOpen}
            onClose={() => setScannerOpen(false)}
            onScan={data => console.log('Gửi server kiểm tra vé:', data)}
          />
        </div>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa sự kiện</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa <strong>{title}</strong> không? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card >
  );
}
