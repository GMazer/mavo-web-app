import React from 'react';
import { ShoppingBagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  // Shared class for nav links to ensure consistency
  const navLinkClass = "relative py-2 hover:text-red-600 transition-colors duration-300 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-red-600 after:transition-transform after:duration-300 hover:after:scale-x-100";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-transparent hover:border-gray-100 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center mr-8">
            <h1 className="text-3xl font-black tracking-tighter uppercase font-sfu-heavy">MAVO</h1>
          </div>

          {/* Desktop Nav - Using font-sfu-book */}
          <nav className="hidden xl:flex space-x-6 text-[13px] font-sfu-book text-gray-800 tracking-wide">
            <a href="#" className={navLinkClass}>QUẦN ÁO</a>
            <a href="#" className={navLinkClass}>GIÀY DÉP</a>
            <a href="#" className={navLinkClass}>TÚI VÀ PHỤ KIỆN</a>
            <a href="#" className={`font-bold text-black ${navLinkClass}`}>SALE OFF</a>
            <a href="#" className={navLinkClass}>BỘ SƯU TẬP</a>
            <a href="#" className={navLinkClass}>TRÌNH DIỄN THỜI TRANG</a>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5 ml-auto">
            <button className="text-gray-800 hover:text-black transition-colors">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            
            {/* Removed Login/Register as requested */}

            <button className="text-gray-800 hover:text-black transition-colors relative flex items-center gap-1">
              <ShoppingBagIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center -mt-3 -ml-2">
                  {cartCount}
                </span>
              )}
            </button>
            
            <span className="text-xs font-medium text-gray-600 cursor-pointer hover:text-black font-sfu-book">VN</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;