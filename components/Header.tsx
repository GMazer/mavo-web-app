import React from 'react';
import { ShoppingBagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  // Base style for nav links
  const navLinkBase = "relative py-2 transition-colors duration-300 inline-block";
  
  // Sliding underline effect
  // - after:bg-current: Underline color follows text color (Red on hover)
  // - scale-x-0 to scale-x-100: Grows from 0 to 100% width
  // - origin logic: Grows from left on hover, shrinks to right on leave
  const hoverEffect = "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-current after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-transparent hover:border-gray-100 transition-colors">
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center mr-16">
            {/* Removed font-black, rely solely on font-sfu-heavy (or Jost Heavy fallback) */}
            <h1 className="text-3xl tracking-tighter uppercase font-sfu-heavy">MAVO</h1>
          </div>

          {/* Desktop Nav - Aligned Left next to Logo */}
          <nav className="hidden xl:flex items-center space-x-8 text-sm font-sfu-book text-gray-600 tracking-wide uppercase">
            {/* Standard links turn Red #E71313 on hover */}
            <a href="#" className={`${navLinkBase} ${hoverEffect} hover:text-[#E71313]`}>QUẦN ÁO</a>
            <a href="#" className={`${navLinkBase} ${hoverEffect} hover:text-[#E71313]`}>GIÀY DÉP</a>
            <a href="#" className={`${navLinkBase} ${hoverEffect} hover:text-[#E71313]`}>TÚI VÀ PHỤ KIỆN</a>
            
            {/* Sale Off starts Black, turns Red #E71313 on hover */}
            <a href="#" className={`${navLinkBase} ${hoverEffect} font-bold text-black hover:text-[#E71313]`}>SALE OFF</a>
            
            <a href="#" className={`${navLinkBase} ${hoverEffect} hover:text-[#E71313]`}>BỘ SƯU TẬP</a>
            
            {/* Changed to match other items: Starts Gray (inherited), turns Red #E71313 on hover */}
            <a href="#" className={`${navLinkBase} ${hoverEffect} hover:text-[#E71313]`}>TRÌNH DIỄN THỜI TRANG</a>
          </nav>

          {/* Icons & Actions - Aligned Right */}
          <div className="flex items-center gap-6 ml-auto">
            <button className="text-black hover:opacity-70 transition-opacity">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            
            {/* Login button removed */}

            {/* Cart */}
            <button className="text-black hover:opacity-70 transition-opacity relative flex items-center">
              <ShoppingBagIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-[#E71313] text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center absolute -top-1 -right-1">
                  {cartCount}
                </span>
              )}
            </button>
            
            <span className="text-sm font-medium text-gray-600 cursor-pointer hover:text-black font-sfu-book">VN</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;