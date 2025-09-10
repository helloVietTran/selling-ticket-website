import AvatarDropdown from '@/components/avatar-dropdown';
import { CreateEventButton } from '@/components/create-event-button';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="fixed right-0 w-[calc(100%-288px)] top-0 z-50 flex items-center justify-between px-8 py-4 bg-[#282a29] border-b border-white/9">

      <h1 className="text-2xl font-bold text-white">Sự kiện của tôi</h1>

      <div className="flex items-center gap-4">
        <CreateEventButton
          fontSize="text-sm py-1.5"
          onClick={() => navigate('/organizer/create-event')}
        >
          <span className="text-lg">+</span>
          <span>Tạo sự kiện</span>
        </CreateEventButton>

        <AvatarDropdown />
      </div>
    </header>
  );
}
