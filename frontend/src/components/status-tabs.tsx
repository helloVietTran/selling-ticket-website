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
    <Tabs value={currentStatus} onValueChange={handleTabChange}>
      <TabsList
        className="bg-gray-100 rounded-sm p-0.5 flex overflow-x-auto no-scrollbar w-full justify-start lg:justify-center"
      >
        {Object.entries(statusLabels).map(([key, label]) => (
          <TabsTrigger
            key={key}
            value={key}
            className="data-[state=active]:bg-[#2ec276]
                   data-[state=active]:text-gray-200
                   rounded-sm px-4 py-3 min-w-[6rem]
                   hover:bg-gray-200 text-[#8a8a8a] font-normal whitespace-nowrap"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}