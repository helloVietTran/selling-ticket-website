import { Outlet, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User, Ticket, Calendar, X, ListCheck, Loader2 } from 'lucide-react';
import Breadcrumb from '@/components/bread-crumb';
import Header from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApi } from '@/api/hooks/useApi';
import { getMyInfo } from '@/api/userApi';

export default function AccountLayout() {
  const [open, setOpen] = useState(false);
  const { exec, data, isPending } = useApi(getMyInfo);

  useEffect(() => {
    exec();
  }, []);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#272729] text-white flex flex-col">
      <Header />

      <div className="max-w-[1200px] mx-auto w-full px-4 py-6 flex justify-between items-center">
        <Breadcrumb />

        <button
          className="md:hidden flex items-center gap-2 text-sm text-gray-300"
          onClick={() => setOpen(true)}>
          <ListCheck className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 mt-4 max-w-6xl mx-auto w-full pb-6 flex gap-4 px-4 md:px-0">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-72 bg-[#1e1e1e] z-50 transform transition-transform duration-300
            ${open ? 'translate-x-0' : '-translate-x-full'} 
            md:relative md:translate-x-0 md:bg-transparent md:w-72
          `}>
          <div className="p-6">
            {/* Close button for mobile */}
            <div className="flex justify-between items-center mb-6 md:hidden">
              <span className="font-bold">Menu</span>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-12 h-12">
                <AvatarImage src={data?.data?.avatar} alt="Việt Trần Danh" />
                <AvatarFallback className="bg-gray-600 text-gray-300">
                  {data?.data?.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm text-gray-300">Tài khoản của</div>
                <div className="font-bold text-lg">{data?.data?.userName}</div>
              </div>
            </div>

            <nav className="space-y-4">
              <NavLink
                to="/my/info"
                className={({ isActive }) =>
                  `flex items-center gap-3 ${
                    isActive ? 'text-green-400 font-semibold' : 'text-white'
                  }`
                }>
                <User /> <span>Thông tin tài khoản</span>
              </NavLink>

              <NavLink
                to="/my/tickets"
                className={({ isActive }) =>
                  `flex items-center gap-3 ${
                    isActive ? 'text-green-400 font-semibold' : 'text-white'
                  }`
                }>
                <Ticket /> <span>Vé của tôi</span>
              </NavLink>

              <NavLink
                to="/organizer/events"
                className={({ isActive }) =>
                  `flex items-center gap-3 ${
                    isActive ? 'text-green-400 font-semibold' : 'text-white'
                  }`
                }>
                <Calendar /> <span>Sự kiện của tôi</span>
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Overlay*/}
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 bg-transparent p-4 md:p-0 mt-4 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
