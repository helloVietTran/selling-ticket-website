import { useSearchParams } from 'react-router-dom';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { statusLabels, type EventStatus } from '@/constant';


export default function StatusTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus =
    (searchParams.get('status') as EventStatus) || '';

  const handleTabChange = (val: string) => {
    setSearchParams({ status: val });
  };

  return (
    <Tabs
      value={currentStatus}
      onValueChange={handleTabChange}
      className="w-fit"
    >
      <TabsList className="bg-gray-100 rounded-sm p-[2px]">
        {Object.entries(statusLabels).map(([key, label]) => (
          <TabsTrigger
            key={key}
            value={key}
            className="data-[state=active]:bg-[#2ec276] 
                       data-[state=active]:text-gray-200 
                       rounded-sm px-4 py-3 w-28 cursor-pointer 
                       hover:bg-gray-200 text-[#8a8a8a] font-normal">
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}