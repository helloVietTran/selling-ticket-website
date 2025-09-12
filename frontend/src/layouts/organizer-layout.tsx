import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Sidebar from '@/features/organizer/components/sidebar';
import TopBar from '@/features/organizer/components/top-bar';

const OrganizerLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/90 to-gray-900 text-white flex">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onRequestClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-full min-[1150px]:min-w-[calc(100%-288px)]">
        <TopBar onToggleMobileSidebar={() => setMobileSidebarOpen(s => !s)} />
        <main className="mt-[72px] overflow-y-auto scrollbar-hidden p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
