import Navigation from '@/components/navigation';
import EventTicketCard from '../components/event-ticket-card';
import EventDescription from '../components/event-description';
import TicketTypeList from '../components/ticket-type-list';
import OrganizerCard from '../components/organizer-card';
import Footer from '@/components/footer';

const EventDetailPage = () => {
  const longHtml = `
    <p>
      Chào mừng bạn đến với <b>Hội nghị Công nghệ 2025</b>! 
      Đây là sự kiện lớn nhất trong năm quy tụ hàng trăm chuyên gia từ nhiều lĩnh vực.
    </p>
    <p>
      <b>Thời gian:</b> 15/09/2025 - 17/09/2025 <br/>
      <b>Địa điểm:</b> Trung tâm Hội nghị Quốc gia, Hà Nội
    </p>
    <h4>Lý do nên tham gia:</h4>
    <ul>
      <li>Nghe chia sẻ từ hơn <b>50 diễn giả quốc tế</b>.</li>
      <li>Tham gia các workshop thực hành về <i>AI, Blockchain, IoT</i>.</li>
      <li>Kết nối với hơn 200 doanh nghiệp và nhà đầu tư.</li>
    </ul>
    <p>
      Ngoài ra, sự kiện còn có khu triển lãm sản phẩm công nghệ mới nhất, 
      nơi bạn có thể trải nghiệm thực tế các ứng dụng tiên tiến.
    </p>
    <p>
      <img src="https://picsum.photos/800/200" alt="Demo" style="border-radius:8px; margin-top:10px;" />
    </p>
    <p>
      <a href="https://example.com/register" target="_blank" style="color:#2563eb; text-decoration:underline;">
        Đăng ký tham gia ngay hôm nay!
      </a>
    </p>
  `;

  const mockTickets = [
    {
      id: 't1',
      time: 'Thứ Bảy, 14/09/2025 - 19:00',
      soldOut: false,
      types: [
        { name: 'Vé thường', price: '200.000đ' },
        { name: 'Vé VIP', price: '500.000đ' },
        { name: 'Vé SV', price: '150.000đ' },
      ],
    },
    {
      id: 't2',
      time: 'Chủ Nhật, 15/09/2025 - 20:00',
      soldOut: true,
      types: [
        { name: 'Vé thường', price: '220.000đ' },
        { name: 'Vé VIP', price: '550.000đ' },
      ],
    },
    {
      id: 't3',
      time: 'Thứ Hai, 16/09/2025 - 18:30',
      soldOut: false,
      types: [
        { name: 'Early Bird', price: '180.000đ' },
        { name: 'Vé thường', price: '250.000đ' },
        { name: 'Vé VIP', price: '600.000đ' },
      ],
    },
  ];

  const organizer = {
    image: 'https://picsum.photos/100/100?random=1',
    name: 'Ban tổ chức A',
    description: 'Đơn vị tổ chức chính, phụ trách toàn bộ sự kiện và hậu cần.',
  };
  return (
    <>
      <Navigation />
      <div
        className="p-4 bg-banner"
        style={{
          background:
            'linear-gradient(rgb(39, 39, 42) 48.04%, rgb(0, 0, 0) 100%)',
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
      <div className="px-4 py-6 space-y-6 bg-[#f6f7fc]">
        <EventDescription htmlContent={longHtml} />
        <TicketTypeList tickets={mockTickets} />
        <OrganizerCard
          image={organizer.image}
          name={organizer.name}
          description={organizer.description}
        />
      </div>
      <Footer />
    </>
  );
};

export default EventDetailPage;
