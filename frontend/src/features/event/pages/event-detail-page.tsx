import Navigation from "@/components/navigation"
import EventTicketCard from "../components/event-ticket-card"


const EventDetailPage = () => {

  return (
    <>
      <Navigation />
      <div className="p-4 bg-banner" style={{
        background: "linear-gradient(rgb(39, 39, 42) 48.04%, rgb(0, 0, 0) 100%)",
      }}>
        <EventTicketCard
          title="LULULOLA SHOW VĂN MAI HƯƠNG | ƯỚT LÒNG"
          date="13 Tháng 09, 2025"
          time="17:30 - 19:30"
          location="Lululola"
          address="Số 32/2 Đường 3/4, Phường 3, Thành Phố Đà Lạt, Tỉnh Lâm Đồng"
          price="560.000 đ"
          image="https://picsum.photos/600/300"
        />
      </div>

    </>
  )
}

export default EventDetailPage