
import React from 'react';
import { ShoppingBagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onLogoClick }) => {
  // Base style for nav links
  const navLinkBase = "relative py-2 transition-colors duration-300 inline-block";
  
  // Sliding underline effect
  const hoverEffect = "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-current after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-transparent hover:border-gray-100 transition-colors">
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center h-20">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center mr-16 cursor-pointer"
            onClick={onLogoClick}
            title="Trang chủ"
          >
            {/* Replaced font-sfu-heavy with font-black (weight 900) to keep it bold/heavy */}
            <h1 className="text-3xl tracking-tighter uppercase font-black">MAVO</h1>
          </div>

          {/* Desktop Nav - Aligned Left next to Logo */}
          <nav className="hidden xl:flex items-center space-x-8 text-sm text-gray-600 tracking-wide uppercase">
            {/* Standard links turn Red #E71313 on hover */}
            <a href="#" onClick={(e) => { e.preventDefault(); onLogoClick(); }} className={`${navLinkBase} ${hoverEffect} hover:text-[#E71313]`}>QUẦN ÁO</a>
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
            
            {/* Cart */}
            <button 
                className="text-black hover:opacity-70 transition-opacity relative flex items-center"
                onClick={onOpenCart}
            >
              <ShoppingBagIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-[#E71313] text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center absolute -top-1 -right-1">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Removed font-sfu-book */}
            <span className="text-sm font-medium text-gray-600 cursor-pointer hover:text-black">VN</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
