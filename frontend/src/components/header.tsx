import { useState } from 'react';
import { Ticket } from 'lucide-react';

import AvatarDropdown from '@/components/avatar-dropdown';
import SearchBox from '@/components/search-box';
import { CreateEventButton } from '@/components/create-event-button';


export default function Header() {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        console.log('Searching for:', query);
    };

    return (
        <header className="w-full bg-emerald-500 text-white ">
            <div className='max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3'>
                <div className="text-2xl font-bold">Nhóm 1</div>

                <SearchBox
                    placeholder="Bạn tìm gì hôm nay?"
                    value={query}
                    onChange={setQuery}
                    onSearch={handleSearch}
                    inputClassName='text-sm'
                    buttonClassName='text-sm'
                />


                <div className="flex items-center space-x-8">
                    <CreateEventButton hoverMode="invert" withBorder fontSize="text-sm">

                        <span>Tạo sự kiện</span>
                    </CreateEventButton>

                    <button className="flex gap-2 text-sm items-center cursor-pointer">
                        <Ticket className='size-5' />
                        Vé của tôi
                    </button>

                    <AvatarDropdown />
                </div>
            </div>
        </header>
    );
}
