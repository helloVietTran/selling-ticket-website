import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ListX, TicketCheck, ListChecks, DollarSign, CheckSquare, ShoppingCart } from 'lucide-react';

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
    icon: <ListChecks size={18} />,
    path: '/organizer/events',
  },
  {
    id: 'revenue',
    label: 'Doanh thu',
    icon: <DollarSign size={18} />,
    path: '/organizer/revenue',
  },
  {
    id: 'check-in',
    label: 'Check-in',
    icon: <CheckSquare size={18} />,
    path: '/organizer/check-in',
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    icon: <ShoppingCart size={18} />,
    path: '/organizer/orders',
  },
];

type SidebarProps = {
  mobileOpen?: boolean;
  onRequestClose?: () => void;
};

export default function Sidebar({
  mobileOpen = false,
  onRequestClose,
}: SidebarProps) {
  const [activeId, setActiveId] = useState<string>('events');

  return (
    <>
      <aside
        className="hidden min-[1150px]:flex w-[288px] sticky top-0 left-0 h-screen bg-gradient-to-b from-emerald-900/80 
      to-gray-800/60 text-white p-6  flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-8">
            <TicketCheck size={24} />
            <span className="text-lg font-semibold">Organizer Center</span>
          </Link>

          <nav className="space-y-4">
            {menu.map(m => (
              <SidebarItem
                key={m.id}
                id={m.id}
                label={m.label}
                icon={m.icon}
                path={m.path}
                active={m.id === activeId}
                onClick={() => setActiveId(m.id)}
              />
            ))}
          </nav>
        </div>
      </aside>

      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${mobileOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
        onClick={onRequestClose}>
        <div className="w-full h-full bg-black/50" />
      </div>

      <aside
        aria-hidden={!mobileOpen}
        className={`fixed z-50 top-0 left-0 h-full w-[288px] bg-gradient-to-b from-emerald-900/95 to-gray-800/95 text-white p-6 transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          min-[1150px]:hidden
        `}
        role="dialog">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-3">
            <TicketCheck size={24} />
            <span className="text-lg font-semibold">Organizer Center</span>
          </Link>
          <button
            onClick={onRequestClose}
            aria-label="Đóng menu"
            className="p-2 rounded-md hover:bg-white/6">
            <ListX size={20} />
          </button>
        </div>

        <nav className="space-y-4">
          {menu.map(m => (
            <SidebarItem
              path={m.path}
              key={m.id}
              id={m.id}
              label={m.label}
              icon={m.icon}
              active={m.id === activeId}
              onClick={() => {
                setActiveId(m.id);
                onRequestClose?.();
              }}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
