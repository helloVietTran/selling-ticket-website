import { Menu } from 'lucide-react';
import { useState } from 'react';

import EventDrawer from './event-drawer';

type SectionHeaderProps = {
  title: string;
  eventId: number | string;
  icon?: React.ElementType;
};

export default function SectionHeader({
  title,
  eventId,
  icon: Icon,
}: SectionHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <h2 className="font-semibold text-xl mb-4 flex gap-2 text-gray-300 items-center">
        {Icon && <Icon size={22} />}
        {title}
      </h2>

      <button
        onClick={() => setDrawerOpen(true)}
        className="p-2 rounded-md cursor-pointer"
        aria-label="Mở menu">
        <Menu
          size={22}
          className="text-gray-300 hover:text-gray-400 transition-colors"
        />
      </button>

      <EventDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        eventId={eventId}
      />
    </div>
  );
}
