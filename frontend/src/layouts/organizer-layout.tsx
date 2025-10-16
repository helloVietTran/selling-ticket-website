import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

import TopBar from '@/features/organizer/components/top-bar';
import { useApi } from '@/api/hooks/useApi';
import { getMyOrganizerRecord } from '@/api/organizerApi';
import { LOCAL_STORAGE_KEYS } from '@/constant';

const OrganizerLayout = () => {
  const { exec, data: organizerData } = useApi(getMyOrganizerRecord);

  useEffect(() => {
    exec();
  }, []);

  // store organizerId to use in other places
  if (organizerData?.data) {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.ORGANIZER_ID,
      JSON.stringify(organizerData.data.organizerId)
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/90 to-gray-900 text-white">
      <TopBar />
      <div className="max-w-[1100px] p-6 mx-auto">
        <main className="overflow-y-auto scrollbar-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
