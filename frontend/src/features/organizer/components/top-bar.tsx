import AvatarDropdown from '@/components/avatar-dropdown';
import { CreateEventButton } from '@/components/create-event-button';
import { Link, useNavigate } from 'react-router-dom';

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-emerald-500 text-white">
      <div className="header-container flex items-center justify-between relative px-4 py-2">
        <Link to="/">
          <img
            src="/assets/logo.svg"
            className="absolute w-13 top-1/2 -translate-y-1/2 left-4"
            alt="Logo"
          />
        </Link>

        <div className="flex items-center gap-4">

          <CreateEventButton
            hoverMode="invert"
            withBorder
            fontSize="text-sm"
            onClick={() => navigate('/organizer/create-event')}>
            <span>Tạo sự kiện</span>
          </CreateEventButton>

          <AvatarDropdown />
        </div>
      </div>
    </header>
  );
}
