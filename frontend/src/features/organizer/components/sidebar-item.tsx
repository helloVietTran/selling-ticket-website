import { Link } from 'react-router-dom';
import React from 'react';

type SidebarItemProps = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  path: string;
  onClick?: (id: string) => void;
};

export default function SidebarItem({
  id,
  label,
  icon,
  path,
  active,
  onClick,
}: SidebarItemProps) {
  return (
    <Link
      to={path}
      onClick={() => onClick?.(id)}
      className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
        active ? 'bg-white/10 text-emerald-400' : 'hover:bg-white/5'
      }`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <div className="text-sm">{label}</div>
    </Link>
  );
}
