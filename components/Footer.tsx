
import React from 'react';
import { AppSettings } from '../types';

interface FooterProps {
    settings?: AppSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  const hotline = settings?.hotline || '1800 6525';
  const email = settings?.email || 'CSKH@MAVOFASHION.COM';

  return (
    <footer className="bg-black text-white pt-16 pb-8 text-sm">
      <div className="w-full px-6 lg:px-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-800 pb-12 mb-12">
            {/* Column 1 */}
            <div>
                <h3 className="text-base font-bold mb-4 uppercase">LIÊN HỆ VỚI MAVO</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-xs">
                    Nếu bạn có thắc mắc hoặc muốn đóng góp ý kiến vui lòng gửi liên hệ cho chúng tôi. 
                    Mọi ý kiến của bạn sẽ giúp cho trải nghiệm dịch vụ sản phẩm tốt hơn nữa
                </p>
                <button className="bg-white text-black px-6 py-2.5 rounded font-bold text-sm uppercase hover:bg-gray-200 transition-colors">
                    Đóng góp ý kiến
                </button>
            </div>

            {/* Column 2 */}
            <div>
                <h3 className="text-base font-bold mb-4 uppercase">HOTLINE: {hotline}</h3>
                <p className="text-gray-400 text-sm mb-2">Thời gian hỗ trợ hành chính: (8:30 - 17:00)</p>
                <p className="text-sm font-bold uppercase mt-6 tracking-wide">EMAIL: {email}</p>
            </div>

             {/* Column 3 */}
            <div className="md:text-right">
                 <h3 className="text-base font-bold mb-6 uppercase">KẾT NỐI VỚI CHÚNG TÔI</h3>
                 <div className="flex gap-6 md:justify-end text-white">
                    {/* Simplified Social Icons to prevent SVG path errors */}
                    
                    {/* Facebook */}
                    <a href="#" className="hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                    </a>
                    
                    {/* Instagram */}
                    <a href="#" className="hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 3h9a4.5 4.5 0 014.5 4.5v9a4.5 4.5 0 01-4.5 4.5h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3z" /></svg>
                    </a>

                    {/* YouTube */}
                    <a href="#" className="hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>

                    {/* TikTok (Placeholder Icon) */}
                    <a href="#" className="hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                    </a>
                 </div>
            </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 border-b border-gray-800 pb-12 mb-8">
            {/* Col 1 */}
            <div className="space-y-8">
                <div>
                    <h4 className="font-bold mb-4 text-sm uppercase text-white">HỆ THỐNG CỬA HÀNG</h4>
                </div>
                 <div>
                    <h4 className="font-bold mb-4 text-sm uppercase text-white">CHÍNH SÁCH</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Mavo Club</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Chính sách mua hàng</a></li>
                         <li><a href="#" className="hover:text-white transition-colors">Chính sách thanh toán</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Chính sách vận chuyển</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
                         <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật thông tin thanh toán</a></li>
                    </ul>
                </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-8">
                 <div>
                    <h4 className="font-bold mb-4 text-sm uppercase text-white">CHĂM SÓC KHÁCH HÀNG</h4>
                     <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Hỏi đáp - FAQs</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold mb-4 text-sm uppercase text-white">TIN TỨC</h4>
                     <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Ra mắt thương hiệu</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-sm uppercase text-white">KIẾN THỨC MẶC ĐẸP</h4>
                     <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn chọn size</a></li>
                    </ul>
                </div>
            </div>
            
            {/* Col 3 */}
            <div className="space-y-8">
                 <div>
                    <h4 className="font-bold mb-4 text-sm uppercase text-white">TÀI LIỆU - TUYỂN DỤNG</h4>
                     <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                    </ul>
                </div>
            </div>

             {/* Col 4 */}
             <div className="space-y-8 col-span-2 lg:col-span-1">
                 <div>
                    <h4 className="font-bold mb-4 text-sm uppercase text-white">VỀ MAVO</h4>
                     <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Câu chuyện về Mavo</a></li>
                        <li className="uppercase font-semibold text-white mt-2">CÔNG TY CỔ PHẦN MAVO VIỆT NAM</li>
                        <li>Điện thoại: {hotline}</li>
                        <li>Email: {email}</li>
                        <li className="leading-relaxed">Giấy chứng nhận đăng ký kinh doanh/Quyết định thành lập/Mã số thuế cá nhân số: 0110627812</li>
                        <li className="leading-relaxed">Ngày cấp: 10/08/2022. Nơi cấp: Cục CS quản lý hành chính trật tự xã hội</li>
                    </ul>
                </div>
            </div>

             {/* Col 5 */}
             <div className="space-y-8 col-span-2 lg:col-span-1">
                 <div>
                    <h4 className="font-bold mb-4 text-sm uppercase text-white">THANH TOÁN</h4>
                     <ul className="space-y-2 text-sm text-gray-400">
                        <li>Chủ tài khoản: CTCP THỜI TRANG MAVO VIỆT NAM</li>
                        <li>STK: 114002967738</li>
                        <li>Ngân hàng TMCP Công thương Việt Nam CN TRÀNG AN - HỘI SỞ</li>
                    </ul>
                     <div className="flex gap-2 mt-4">
                         <div className="h-6 w-10 bg-white rounded flex items-center justify-center"><span className="text-[8px] font-bold text-black">CASH</span></div>
                         <div className="h-6 w-10 bg-white rounded flex items-center justify-center"><span className="text-[8px] font-bold text-blue-800">VISA</span></div>
                         <div className="h-6 w-10 bg-white rounded flex items-center justify-center"><span className="text-[8px] font-bold text-red-600">MASTER</span></div>
                         <div className="h-6 w-10 bg-white rounded flex items-center justify-center"><span className="text-[8px] font-bold text-green-600">ATM</span></div>
                     </div>
                </div>
                 <div>
                    <h4 className="font-bold mb-2 text-sm uppercase text-white">NGÔN NGỮ</h4>
                     <button className="border border-gray-600 px-3 py-1 text-sm hover:border-white transition-colors text-gray-300 hover:text-white">VN</button>
                </div>
            </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
             <div className="flex items-center gap-4">
                <p>Copyright © 2024 Mavo. All Rights Reserved.</p>
                <a href="/admin-app/index.html" className="text-[10px] text-gray-500 hover:text-white border border-gray-700 hover:border-white px-2 py-0.5 rounded transition-colors">Go to Admin CMS</a>
             </div>
             <div className="flex gap-4 mt-4 md:mt-0 items-center">
                <img src="http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png" alt="Bo Cong Thuong" className="h-10" />
                <div className="h-8 border border-gray-600 px-2 flex items-center text-gray-400 rounded hover:border-gray-400 cursor-pointer">
                    DMCA PROTECTED
                </div>
             </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
