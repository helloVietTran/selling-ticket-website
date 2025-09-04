'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchBox() {
  const [query, setQuery] = React.useState('');

  const handleSearch = () => {
    console.log('Searching for:', query);
  };

  return (
    <div className="flex w-[300px] max-w-md items-center rounded-sm border bg-white shadow-sm">
      <div className="flex items-center px-3 flex-1">
        <Search className="h-5 w-5 text-gray-500 mr-2" />
        <Input
          type="text"
          placeholder="Tìm kiếm sự kiện..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border-0 focus-visible:ring-0 focus:outline-none flex-1 text-[#333333]"
        />
      </div>

      <Button
        onClick={handleSearch}
        className="rounded-l-none font-normal border-l border-gray-200 bg-white text-[#333333] hover:bg-gray-200 cursor-pointer"
      >
        Tìm kiếm
      </Button>
    </div>
  );
}
