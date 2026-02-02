import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 text-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-800 pb-12 mb-12">
            {/* Column 1 */}
            <div>
                <h3 className="text-base font-bold mb-4 uppercase">LIÊN HỆ VỚI MAVO</h3>
                <p className="text-gray-400 text-xs mb-6 leading-relaxed max-w-xs">
                    Nếu bạn có thắc mắc hoặc muốn đóng góp ý kiến vui lòng gửi liên hệ cho chúng tôi. 
                    Mọi ý kiến của bạn sẽ giúp cho trải nghiệm dịch vụ sản phẩm tốt hơn nữa
                </p>
                <button className="bg-white text-black px-6 py-2.5 rounded font-bold text-xs uppercase hover:bg-gray-200 transition-colors">
                    Đóng góp ý kiến
                </button>
            </div>

            {/* Column 2 */}
            <div>
                <h3 className="text-base font-bold mb-4 uppercase">HOTLINE: 1800 6525</h3>
                <p className="text-gray-400 text-xs mb-2">Thời gian hỗ trợ hành chính: (8:30 - 17:00)</p>
                <p className="text-sm font-bold uppercase mt-6 tracking-wide">EMAIL: CSKH@MAVOFASHION.COM</p>
            </div>

             {/* Column 3 */}
            <div className="md:text-right">
                 <h3 className="text-base font-bold mb-6 uppercase">KẾT NỐI VỚI CHÚNG TÔI</h3>
                 <div className="flex gap-6 md:justify-end text-white">
                    {/* Social Icons SVGs */}
                    <a href="#" className="hover:text-gray-300 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                    <a href="#" className="hover:text-gray-300 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                    <a href="#" className="hover:text-gray-300 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                    <a href="#" className="hover:text-gray-300 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>
                    <a href="#" className="hover:text-gray-300 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.1-.28-.24-.59-.52-.81-.88v13.3c0 1.64-.42 3.42-1.53 4.71-1.37 1.63-3.62 2.72-5.75 2.87-2.92.21-6.07-1.11-7.67-3.66-1.92-3.03-1.49-7.39 1.09-10.1 2.25-2.39 5.86-3 8.86-1.64v4.36c-1.54-1.1-3.7-1.12-5.32-.19-1.38.8-2.15 2.45-1.92 4.02.26 1.73 1.84 3.13 3.58 3.16 1.6.03 3.12-1.09 3.46-2.68.16-.76.15-1.54.15-2.31V.02h1.79z"/></svg></a>
                 </div>
            </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 border-b border-gray-800 pb-12 mb-8">
            {/* Col 1 */}
            <div className="space-y-8">
                <div>
                    <h4 className="font-bold mb-4 text-xs uppercase text-white">HỆ THỐNG CỬA HÀNG</h4>
                </div>
                 <div>
                    <h4 className="font-bold mb-4 text-xs uppercase text-white">CHÍNH SÁCH</h4>
                    <ul className="space-y-2 text-xs text-gray-400">
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
                    <h4 className="font-bold mb-4 text-xs uppercase text-white">CHĂM SÓC KHÁCH HÀNG</h4>
                     <ul className="space-y-2 text-xs text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Hỏi đáp - FAQs</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold mb-4 text-xs uppercase text-white">TIN TỨC</h4>
                     <ul className="space-y-2 text-xs text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Ra mắt thương hiệu</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-xs uppercase text-white">KIẾN THỨC MẶC ĐẸP</h4>
                     <ul className="space-y-2 text-xs text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn chọn size</a></li>
                    </ul>
                </div>
            </div>
            
            {/* Col 3 */}
            <div className="space-y-8">
                 <div>
                    <h4 className="font-bold mb-4 text-xs uppercase text-white">TÀI LIỆU - TUYỂN DỤNG</h4>
                     <ul className="space-y-2 text-xs text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                    </ul>
                </div>
            </div>

             {/* Col 4 */}
             <div className="space-y-8 col-span-2 lg:col-span-1">
                 <div>
                    <h4 className="font-bold mb-4 text-xs uppercase text-white">VỀ MAVO</h4>
                     <ul className="space-y-2 text-xs text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Câu chuyện về Mavo</a></li>
                        <li className="uppercase font-semibold text-white mt-2">CÔNG TY CỔ PHẦN MAVO VIỆT NAM</li>
                        <li>Điện thoại: 18006525</li>
                        <li>Email: cskh@mavofashion.com</li>
                        <li className="leading-relaxed">Giấy chứng nhận đăng ký kinh doanh/Quyết định thành lập/Mã số thuế cá nhân số: 0110627812</li>
                        <li className="leading-relaxed">Ngày cấp: 10/08/2022. Nơi cấp: Cục CS quản lý hành chính trật tự xã hội</li>
                    </ul>
                </div>
            </div>

             {/* Col 5 */}
             <div className="space-y-8 col-span-2 lg:col-span-1">
                 <div>
                    <h4 className="font-bold mb-4 text-xs uppercase text-white">THANH TOÁN</h4>
                     <ul className="space-y-2 text-xs text-gray-400">
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
                    <h4 className="font-bold mb-2 text-xs uppercase text-white">NGÔN NGỮ</h4>
                     <button className="border border-gray-600 px-3 py-1 text-xs hover:border-white transition-colors text-gray-300 hover:text-white">VN</button>
                </div>
            </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
             <p>Copyright © 2024 Mavo. All Rights Reserved.</p>
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