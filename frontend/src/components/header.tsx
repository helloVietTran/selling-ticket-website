import { useState } from 'react';
import { Ticket, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AvatarDropdown from '@/components/avatar-dropdown';
import SearchBox from '@/components/search-box';
import { CreateEventButton } from '@/components/create-event-button';
import { useAuth } from '@/context/auth-context';
import { useAuthModal } from '@/context/auth-modal-context';

const Header = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { openLogin, openRegister } = useAuthModal();

  const handleSearch = () => {
    navigate(`/search?q=${query}`);
  };

  return (
    <header className="w-full bg-emerald-500 text-white">
      <div className="header-container flex items-center justify-between relative px-4 py-2">
        <Link to="/">
          <img
            src="/assets/logo.svg"
            className="absolute w-13 top-1/2 -translate-y-1/2 left-4"
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

          {isAuthenticated && (
            <CreateEventButton
              hoverMode="invert"
              withBorder
              fontSize="text-sm"
              onClick={() => navigate('/organizer/create-event')}>
              <span>Tạo sự kiện</span>
            </CreateEventButton>
          )}

          {isAuthenticated && (
            <button
              className="flex gap-2 text-sm items-center cursor-pointer"
              onClick={() => navigate('/my/tickets')}>
              <Ticket className="size-5" />
              <span className="hidden sm:inline">Vé của tôi</span>
            </button>
          )}

          {isAuthenticated ? (
            <AvatarDropdown />
          ) : (
            <div className="flex gap-2 text-sm">
              <button
                onClick={openRegister}
                className="hover:underline cursor-pointer">
                Đăng ký
              </button>
              <span>|</span>
              <button
                onClick={openLogin}
                className="hover:underline cursor-pointer">
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
