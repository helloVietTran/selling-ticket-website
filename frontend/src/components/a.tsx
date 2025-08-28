import React from "react";


function TopBar() {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-emerald-900/80 to-gray-900/80 border-b border-white/5">
      <div>
        <h1 className="text-3xl font-bold text-white">Sự kiện của tôi</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <span className="text-xl">+</span>
          <span>Tạo sự kiện</span>
        </button>

        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">A</div>
      </div>
    </header>
  );
}

function SearchAndTabs() {
  return (
    <div className="px-8 py-6 flex items-center gap-6">
      <div className="flex-1 flex items-center gap-4">
        <div className="flex items-center bg-white/6 rounded overflow-hidden w-full max-w-xl">
          <input
            className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-white/70"
            placeholder="Tìm kiếm sự kiện..."
          />
          <button className="bg-white/10 px-4 py-2">Tìm kiếm</button>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full bg-emerald-500 text-white">Sắp tới</button>
          <button className="px-4 py-2 rounded-full bg-white/6 text-white">Đã qua</button>
          <button className="px-4 py-2 rounded-full bg-white/6 text-white">Chờ duyệt</button>
          <button className="px-4 py-2 rounded-full bg-white/6 text-white">Nháp</button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-white/80">
        <div className="mx-auto w-36 h-36 rounded bg-white/6 flex items-center justify-center mb-6">
          {/* minimal box icon */}
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" stroke="#fff" strokeOpacity="0.75" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 7v10m18-10v10M12 3v18" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-xl font-medium">No data</div>
        <div className="mt-2 text-sm">Bạn chưa có sự kiện nào. Hãy tạo sự kiện để bắt đầu.</div>
      </div>
    </div>
  );
}

export default function OrganizerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black/90 to-gray-900 text-white flex">

      <div className="flex-1 flex flex-col">
        <TopBar />
        <SearchAndTabs />

        <main className="flex-1 px-8 py-6">
          <div className="bg-gradient-to-b from-transparent to-black/40 rounded-lg min-h-[60vh] border border-white/5 overflow-hidden">
            {/* main content area: left main + (right panel intentionally omitted per request) */}
            <div className="h-full flex">
              <div className="flex-1 flex flex-col">
                <EmptyState />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
