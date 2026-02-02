import React from 'react';
import { ShoppingBagIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  // Shared class for nav links
  const navLinkClass = "relative py-2 hover:text-black transition-colors duration-300";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-transparent hover:border-gray-100 transition-colors">
      {/* Changed max-w-[1600px] mx-auto to w-full for full-width layout */}
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center mr-16">
            <h1 className="text-3xl font-black tracking-tighter uppercase font-sfu-heavy">MAVO</h1>
          </div>

          {/* Desktop Nav - Aligned Left next to Logo */}
          <nav className="hidden xl:flex items-center space-x-8 text-[13px] font-sfu-book text-gray-600 tracking-wide uppercase">
            <a href="#" className={navLinkClass}>QUẦN ÁO</a>
            <a href="#" className={navLinkClass}>GIÀY DÉP</a>
            <a href="#" className={navLinkClass}>TÚI VÀ PHỤ KIỆN</a>
            <a href="#" className={`font-bold text-black ${navLinkClass}`}>SALE OFF</a>
            <a href="#" className={navLinkClass}>BỘ SƯU TẬP</a>
            <a href="#" className={navLinkClass}>TRÌNH DIỄN THỜI TRANG</a>
          </nav>

          {/* Icons & Actions - Aligned Right */}
          <div className="flex items-center gap-6 ml-auto">
            <button className="text-black hover:opacity-70 transition-opacity">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            
            {/* Login / Register */}
            <button className="hidden md:flex items-center gap-2 text-[13px] text-gray-600 hover:text-black font-sfu-book transition-colors">
              <span className="w-5 h-5 border border-gray-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
              </span>
              Đăng nhập
            </button>

            {/* Cart */}
            <button className="text-black hover:opacity-70 transition-opacity relative flex items-center">
              <ShoppingBagIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center absolute -top-1 -right-1">
                  {cartCount}
                </span>
              )}
            </button>
            
            <span className="text-[13px] font-medium text-gray-600 cursor-pointer hover:text-black font-sfu-book">VN</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;