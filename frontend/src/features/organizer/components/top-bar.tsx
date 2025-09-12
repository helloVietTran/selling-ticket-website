import AvatarDropdown from '@/components/avatar-dropdown';
import { CreateEventButton } from '@/components/create-event-button';
import { useNavigate } from 'react-router-dom';
import { ListCheck } from 'lucide-react';

type TopBarProps = {
  onToggleMobileSidebar?: () => void;
};

export default function TopBar({ onToggleMobileSidebar }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header
      className="
        fixed top-0 z-49 right-0
        min-[1150px]:left-[288px] left-0
        min-[1150px]:w-[calc(100%-288px)] w-full
        flex items-center justify-between px-4 md:px-8 py-4 bg-[#282a29] border-b border-white/9
      ">
      <h1 className="text-2xl font-bold text-white">Sự kiện của tôi</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-md hover:bg-white/6 block min-[1150px]:hidden"
          aria-label="Mở menu">
          <ListCheck size={20} />
        </button>

        <CreateEventButton
          fontSize="text-sm py-1.5"
          onClick={() => navigate('/organizer/create-event')}>
          <span className="text-lg">+</span>
          <span>Tạo sự kiện</span>
        </CreateEventButton>

        <AvatarDropdown />
      </div>
    </header>
  );
}
