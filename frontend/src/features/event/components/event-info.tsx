import EventDescription from "./event-description";
import OrganizerCard from "./organizer-card"
import TicketTypeList from "./ticket-type-list";

const EventInfo = () => {
    const html = `
        🌸 <b>Thỏa sức sáng tạo - Vẽ ly gốm</b> 🌸<br>
        Khơi dậy khả năng nghệ thuật và cá tính riêng qua hoạt động vẽ trên ly gốm.<br>
        <p class="info">⏰ Thời gian: </p><p>10:00 - 12:30</p>
        <p class="info">📍 Địa chỉ: </p><p>123 Đường ABC, Quận 1, TP.HCM</p>
        <p class="info">💵 Phí tham dự: </p><p>200.000đ/người</p>
      `;

    const tickets = [
        {
            id: "1",
            time: "17:30 - 19:30, 11 Tháng 09, 2025",
            soldOut: false,
            types: [{ name: "Tiêu chuẩn", price: "390.000 đ" }],
        },
        {
            id: "2",
            time: "14:00 - 16:00, 15 Tháng 09, 2025",
            soldOut: true,
            types: [{ name: "Tiêu chuẩn", price: "Hết vé" }],
        },
        {
            id: "3",
            time: "17:30 - 19:30, 18 Tháng 09, 2025",
            soldOut: false,
            types: [{ name: "VIP", price: "600.000 đ" }],
        },
    ];

    return (
        <div className="bg-[#f6f7fc] p-4">
            <EventDescription htmlContent={html} />
            <TicketTypeList tickets={tickets} />
            <OrganizerCard

                image="https://picsum.photos/200"
                name={"Tên ban tổ chức"}
                description={"hello 123"}
            />


        </div>
    )
}

export default EventInfo