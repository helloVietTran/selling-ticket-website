import { useEffect, useState } from 'react';
import { Calendar, MapPin, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EventHeaderProps {
  title: string;
  datetime: string;
  location: string;
  initialMinutes?: number;
}

export default function EventBanner({
  title,
  datetime,
  location,
  initialMinutes = 5,
}: EventHeaderProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setShowModal(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <>
      <div
        className="relative h-50 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://picsum.photos/1920/1080?random')",
        }}>
        <div className="absolute left-0 right-0 backdrop-blur-md bg-black/50 h-50 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 px-12 pt-4 pb-6">
            <div className="flex-1 text-white drop-shadow">
              <h1 className="text-2xl font-bold leading-snug mb-4 pb-2 border-b border-white">
                {title}
              </h1>
              <div className="mt-3 space-y-2 text-neutral-200 font-semibold text-lg">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span>{datetime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-10 flex flex-col items-center">
              <span className="text-lg text-neutral-200 mb-2">
                Hoàn tất đặt vé trong
              </span>
              <div className="flex items-center gap-2 text-3xl font-bold text-white">
                <span className="bg-red-500/80 px-3 py-2 rounded-lg">
                  {minutes}
                </span>
                <span>:</span>
                <span className="bg-red-500/80 px-3 py-2 rounded-lg">
                  {seconds}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeout Modal */}
      <Dialog open={showModal}>
        <DialogContent
          className="sm:max-w-md text-center"
          showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Hết thời gian giữ vé!
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center my-4">
            <Bell size={48} className="text-gray-600 animate-shake" />
          </div>

          <p className="text-gray-600 mb-6">
            Đã hết thời gian giữ vé. Vui lòng đặt lại vé mới.
          </p>

          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-5 rounded-full"
            onClick={() => {
              setTimeLeft(initialMinutes * 60);
              setShowModal(false);
            }}>
            Đặt vé mới
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
