import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/sidebar';
import TopBar from '@/components/top-bar';

const OrganizerLayout = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-black/90 to-gray-900 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 px-8 pt-4 overflow-y-auto scrollbar-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
