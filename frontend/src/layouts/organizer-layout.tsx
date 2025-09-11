import { Outlet } from "react-router-dom";

import Sidebar from "@/features/organizer/components/sidebar";
import TopBar from "@/features/organizer/components/top-bar";

const OrganizerLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black/90 to-gray-900 text-white flex">
     
      <div className="w-[288px] ">
        <Sidebar />  {/* 288px of side bar */}
      </div>

      <div className="flex-1 flex flex-col min-w-[calc(100%-288px)]">
        <TopBar /> {/* 72px of top bar */}
        <main className="mt-[72px] overflow-y-auto scrollbar-hidden p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
