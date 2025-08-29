import { AvatarDropdown } from "./avatar-dropdown";

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#282a29] border-b border-white/9">
      <div>
        <h1 className="text-2xl font-bold text-white">Sự kiện của tôi</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <span className="text-xl">+</span>
          <span>Tạo sự kiện</span>
        </button>

        <AvatarDropdown />
      </div>
    </header>
  );
}
