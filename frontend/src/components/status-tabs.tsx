import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StatusTabs() {
  const [activeTab, setActiveTab] = React.useState('saptoi');

  return (
    <div>
      <Tabs
        defaultValue="saptoi"
        value={activeTab}
        onValueChange={val => setActiveTab(val)}
        className="w-fit">
        <TabsList className="bg-gray-100 rounded-sm p-0.25!">
          <TabsTrigger
            value="saptoi"
            className="data-[state=active]:bg-[#2ec276] data-[state=active]:text-gray-200 rounded-sm px-4 py-3 w-28 cursor-pointer hover:bg-gray-200 text-[#8a8a8a] font-normal">
            Sắp tới
          </TabsTrigger>
          <TabsTrigger
            value="daqua"
            className=" data-[state=active]:bg-[#2ec276] data-[state=active]:text-gray-200 rounded-sm px-4 py-3 w-28 cursor-pointer hover:bg-gray-200 text-[#8a8a8a] font-normal">
            Đã qua
          </TabsTrigger>
          <TabsTrigger
            value="choduyet"
            className="data-[state=active]:bg-[#2ec276] data-[state=active]:text-gray-200 rounded-sm px-4 py-3 w-28 cursor-pointer hover:bg-gray-200 text-[#8a8a8a] font-normal">
            Chờ duyệt
          </TabsTrigger>
          <TabsTrigger
            value="nhap"
            className="data-[state=active]:bg-[#2ec276] data-[state=active]:text-gray-200 rounded-sm px-4 py-3 w-28 cursor-pointer hover:bg-gray-200 text-[#8a8a8a] font-normal">
            Nháp
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
