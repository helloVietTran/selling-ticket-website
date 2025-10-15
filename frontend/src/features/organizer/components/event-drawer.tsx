import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Users, ShoppingCart, MoveLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type EventDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId: number | string;
};

export default function EventDrawer({
  isOpen,
  onClose,
  eventId,
}: EventDrawerProps) {
  const navItems = [
    {
      to: `/organizer/revenue/events/${eventId}`,
      label: 'Doanh thu',
      icon: <DollarSign size={18} />,
    },
    {
      to: `/organizer/orders/events/${eventId}`,
      label: 'Đơn hàng',
      icon: <ShoppingCart size={18} />,
    },
    {
      to: `/organizer/check-in/events/${eventId}`,
      label: 'Danh sách check-in',
      icon: <Users size={18} />,
    },
    {
      to: '/organizer/events',
      label: 'Quay lại',
      icon: <MoveLeft size={18} />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed top-0 left-0 w-full sm:w-[300px] md:w-[320px] lg:w-[360px] h-full 
                       bg-gradient-to-b from-emerald-900/95 to-gray-800/95 
                       text-white shadow-xl z-50 flex flex-col p-6"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35 }}>
            <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-3">
              <h3 className="text-xl font-semibold text-gray-100">
                Sự kiện {eventId}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
                     ${
                       isActive
                         ? 'bg-emerald-600/90 text-white shadow-md'
                         : 'hover:bg-emerald-700/60 text-gray-200 hover:text-white'
                     }`
                  }>
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
