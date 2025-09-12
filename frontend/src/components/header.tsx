import { useState } from 'react';
import { Ticket, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AvatarDropdown from '@/components/avatar-dropdown';
import SearchBox from '@/components/search-box';
import { CreateEventButton } from '@/components/create-event-button';

const Header = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?q=${query}`);
  };

  return (
    <header className="w-full bg-emerald-500 text-white">
      <div className="header-container flex items-center justify-between relative px-4 py-2">
        <Link to="/">
          <img
            src="/assets/logo.png"
            className="absolute w-20 top-1.5 z-2"
            alt="Logo"
          />
        </Link>

        <div className="hidden lg:block  mx-4">
          <SearchBox
            placeholder="Bạn tìm gì hôm nay?"
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            inputClassName="text-sm"
            buttonClassName="text-sm"
          />
        </div>

        <div className="flex items-center space-x-4 lg:space-x-8">
          <button
            className="block lg:hidden p-2 rounded-full border border-white"
            onClick={() => navigate('/search')}>
            <Search className="size-5" />
          </button>

          <CreateEventButton
            hoverMode="invert"
            withBorder
            fontSize="text-sm"
            onClick={() => navigate('/organizer/create-event')}>
            <span>Tạo sự kiện</span>
          </CreateEventButton>

          <button
            className="flex gap-2 text-sm items-center cursor-pointer"
            onClick={() => navigate('/my/tickets')}>
            <Ticket className="size-5" />
            <span className="hidden sm:inline">Vé của tôi</span>
          </button>

          <AvatarDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
