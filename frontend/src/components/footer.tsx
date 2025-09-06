import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const aboutCompany = [
    'Quy chế hoạt động',
    'Chính sách bảo mật thông tin',
    'Cơ chế giải quyết tranh chấp/ khiếu nại',
    'Chính sách bảo mật thanh toán',
    'Chính sách đổi trả và kiểm hàng',
    'Điều kiện vận chuyển và giao nhận',
    'Phương thức thanh toán',
  ];
  return (
    <footer className="bg-[#1f1f2e] text-gray-300 px-5 py-10">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 text-center md:text-left">
        {/* Cột liên hệ */}
        <div className="space-y-4">
          <h3 className="text-white font-bold mb-2">Hotline</h3>
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-400">
            <Phone size={14} />
            <span>Thứ 2 - Chủ Nhật (8:00 - 23:00)</span>
            <span className="text-sm font-bold text-[#00c853]">1900.6408</span>
          </div>

          <h3 className="text-white font-bold mt-5 mb-2">Email</h3>
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-400">
            <Mail size={16} />
            <span>spnhom1@ticketbox.vn</span>
          </div>

          <h3 className="text-white font-bold mt-5 mb-2">Văn phòng chính</h3>
          <div className="text-xs text-gray-400">
            <Link to="#" className="hover:text-[#00c853] transition-colors ">
              Tầng 5, Tòa nhà B, Khu A,
              <br />
              Trường Đại học Mỏ - Địa chất, TP. Hà Nội
            </Link>
          </div>
        </div>

        {/* Cột khách hàng và ban tổ chức */}
        <div className="space-y-4">
          <h3 className="text-white font-bold mb-2">Dành cho Khách hàng</h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <Link to="#" className="hover:text-[#00c853] transition-colors">
                Điều khoản sử dụng cho khách hàng
              </Link>
            </li>
          </ul>

          <h3 className="text-white font-bold mt-5 mb-2">
            Dành cho Ban Tổ chức
          </h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <Link to="#" className="hover:text-[#00c853] transition-colors">
                Điều khoản sử dụng cho ban tổ chức
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-bold mb-2">Về công ty chúng tôi</h3>
          <ul className="space-y-3 text-xs text-gray-400">
            {aboutCompany.map((item, idx) => (
              <li key={idx}>
                <Link to="#" className="hover:text-[#00c853] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
