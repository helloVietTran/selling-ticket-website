
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, Ticket, Calendar, LogOut } from 'lucide-react';

export default function AvatarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="size-10 cursor-pointer rounded-full bg-white/10 flex items-center justify-center hover:ring-2 hover:ring-emerald-500 transition">
          <User className="size-6 text-white" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 bg-white rounded-xl shadow-lg p-2">
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Ticket className="w-4 h-4" />
          Vé của tôi
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Calendar className="w-4 h-4" />
          Sự kiện của tôi
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <User className="w-4 h-4" />
          Tài khoản của tôi
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
