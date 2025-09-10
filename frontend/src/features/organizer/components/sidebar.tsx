import { useState } from 'react';
import { RiCalendarEventLine, RiFileList3Line } from 'react-icons/ri';
import { IoStatsChart } from 'react-icons/io5';
import { LuScanLine } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import SidebarItem from '@/features/organizer/components/sidebar-item';

type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
};

const menu: MenuItem[] = [
  {
    id: 'events',
    label: 'Sự kiện của tôi',
    icon: <RiCalendarEventLine />,
    path: '/organizer/events',
  },
  {
    id: 'revenue',
    label: 'Doanh thu',
    icon: <IoStatsChart />,
    path: '/organizer/revenue',
  },
  {
    id: 'check-in',
    label: 'Check-in',
    icon: <LuScanLine />,
    path: '/organizer/check-in',
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    icon: <RiFileList3Line />,
    path: '/organizer/orders',
  },
];

export default function Sidebar() {
  const [activeId, setActiveId] = useState<string>('events');
  const navigate = useNavigate();

  const handleClick = (id: string, path: string) => {
    setActiveId(id);
    navigate(path);
  };

  return (
    <aside className="sticky top-0 left-0 h-screen w-[288px] bg-gradient-to-b from-emerald-900/80 to-gray-800/60 text-white p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center font-bold">
            N1
          </div>
          <div>
            <div className="text-lg font-semibold">Organizer Center</div>
          </div>
        </div>

        <nav className="space-y-4">
          {menu.map(m => (
            <SidebarItem
              key={m.id}
              id={m.id}
              label={m.label}
              icon={m.icon}
              active={m.id === activeId}
              onClick={() => handleClick(m.id, m.path)}
            />
          ))}
        </nav>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="text-sm">Ngôn ngữ</div>
        <div className="inline-flex items-center gap-2 bg-white/6 rounded-full px-3 py-2">
          <span className="text-xs">Vie</span>
          <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-xs">
            🇻🇳
          </span>
        </div>
      </div>
    </aside>
  );
}
