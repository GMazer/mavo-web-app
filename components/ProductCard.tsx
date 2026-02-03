import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: () => void; // Optional click handler for navigation
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  return (
    <div className="group cursor-pointer block" onClick={onClick}>
      {/* Aspect Ratio 2/3 for tall fashion images */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
        
        {/* MUA NGAY Button - Slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                }}
                /* Removed font-sfu-book */
                className="w-full bg-white text-black font-bold text-[11px] py-3 uppercase tracking-wider hover:bg-gray-50 shadow-md border border-transparent hover:border-gray-200"
            >
                Mua ngay
            </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-4 flex flex-col gap-1.5">
        {/* Product Name: Clean, light/regular font, left aligned. Removed font-sfu-book. */}
        <h3 className="text-sm text-gray-700 truncate leading-normal hover:text-black transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          {/* Removed font-sfu-book */}
          <p className="text-sm text-black font-normal">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price).replace('₫', '')} ₫
          </p>
          {product.originalPrice && (
            /* Removed font-sfu-book */
            <p className="text-sm text-gray-400 line-through decoration-gray-400 font-light">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice).replace('₫', '')} ₫
            </p>
          )}
        </div>
        
        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 mt-2">
                {product.colors.map((color, idx) => (
                    <div 
                        key={idx}
                        // Outer Ring: Increased size to w-5 h-5 (20px), added padding to create gap between color and border
                        className="w-5 h-5 rounded-full border border-gray-300 p-[2px] cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-center"
                    >
                        {/* Inner Color Circle */}
                        <div 
                            className="w-full h-full rounded-full"
                            style={{ 
                                backgroundColor: color,
                                // Add a subtle border for white colors so they don't blend into the white gap
                                border: color.toLowerCase() === '#ffffff' ? '1px solid #e5e7eb' : 'none'
                            }}
                        >
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;