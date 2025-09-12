import EventBanner from '@/features/booking/components/event-banner';
import BookingInfo from '@/features/booking/components/booking-info';

const BookingPage = () => {
  return (
    <div className="main-bg-content min-h-[90vh] !p-0 space-y-4 !pb-4">
      <EventBanner
        title="[FLOWER 1969’s] ROLLERBALL PERFUME WORKSHOP – TRẢI NGHIỆM LÀM NƯỚC HOA LĂN"
        datetime="17:00 - 19:00, 13 Tháng 09, 2025"
        location="The Seat Cafe"
        initialMinutes={0}
      />
      <BookingInfo
        tickets={[
          {
            ticketName: 'Vé Thường (Workshop Nước ngoài ...)',
            ticketPrice: 310000,
            quantity: 1,
          },
          {
            ticketName: 'Vé VIP (Chỗ ngồi ưu tiên + Quà tặng)',
            ticketPrice: 500000,
            quantity: 2,
          },
        ]}
        onChangeTicket={() => alert('Chọn lại vé')}
        onContinue={() => alert('Tiếp tục đặt vé')}
      />
    </div>
  );
};

export default BookingPage;
