import AvatarDropdown from '@/components/avatar-dropdown';
import { CreateEventButton } from '@/components/create-event-button';

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#282a29] border-b border-white/9">
      <div>
        <h1 className="text-2xl font-bold text-white">Sự kiện của tôi</h1>
      </div>

      <div className="flex items-center gap-4">
        <CreateEventButton fontSize="text-sm py-1.5">
          <span className="text-lg">+</span>
          <span>Tạo sự kiện</span>
        </CreateEventButton>

        <AvatarDropdown />
      </div>
    </header>
  );
}
