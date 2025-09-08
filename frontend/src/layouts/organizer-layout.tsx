import { Outlet } from 'react-router-dom';

import Sidebar from '@/features/organizer/components/sidebar';
import TopBar from '@/features/organizer/components/top-bar';

const OrganizerLayout = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-black/90 to-gray-900 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 overflow-y-auto scrollbar-hidden p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
