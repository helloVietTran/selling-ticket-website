import React from "react";
import EventCard from "@/components/event-card";

const events = [

  { title: "GARDEN ART - FRUIT MOCHI CHEESECAKE", price: "390.000đ", date: "11/09/2025", img: "https://picsum.photos/400/200?5" },
  { title: "WORKSHOP PERFUME - LÀM NƯỚC HOA", price: "279.000đ", date: "06/09/2025", img: "https://picsum.photos/400/200?6" },
  { title: "MOSS FRAME - TRANH THIÊN NHIÊN", price: "315.000đ", date: "31/05/2025", img: "https://picsum.photos/400/200?7" },
  { title: "ROLLERBALL PERFUME WORKSHOP", price: "279.000đ", date: "06/09/2025", img: "https://picsum.photos/400/200?8" },
];

const EventList: React.FC = () => {
  return (
    <div>
      <h2 className="text-white text-xl mb-5">Dành cho bạn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <EventCard key={index} {...event} href="detail.html" />
        ))}
      </div>
    </div>
  );
};

export default EventList;
