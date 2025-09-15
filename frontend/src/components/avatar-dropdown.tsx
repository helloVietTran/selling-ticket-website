import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, Ticket, Calendar, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

type AvatarDropdownProps = {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
};

export default function AvatarDropdown({
  side = 'bottom',
  align = 'end',
}: AvatarDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="bg-red-400">
        <button className="size-10 cursor-pointer rounded-full bg-white/10 flex items-center justify-center hover:ring-2 hover:ring-emerald-500 transition">
          <User className="size-6 text-white" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side}
        align={align}
        className="w-48 bg-white rounded-xl shadow-lg p-2">
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Link
            to="/my/tickets"
            className="flex items-center gap-2 cursor-pointer">
            <Ticket className="w-4 h-4" />
            Vé của tôi
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            to="/organizer/events"
            className="flex items-center gap-2 cursor-pointer">
            <Calendar className="w-4 h-4" />
            Sự kiện của tôi
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Link
            to="/my/info"
            className="flex items-center gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            Tài khoản của tôi
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2 text-red-600 cursor-pointer">
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
