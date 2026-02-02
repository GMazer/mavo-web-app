import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group cursor-pointer block">
      {/* Changed aspect ratio to 2/3 for a taller, larger image presentation */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        {product.originalPrice && (
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[11px] font-bold px-2 py-1 z-10">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
        )}
        
        {/* MUA NGAY Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                }}
                className="w-full bg-white text-black font-bold text-xs py-3 uppercase tracking-wider hover:bg-gray-50 shadow-md font-sfu-book border border-transparent hover:border-gray-200"
            >
                Mua ngay
            </button>
        </div>
      </div>

      {/* Increased spacing between image and details (mt-4) */}
      <div className="mt-4 flex flex-col gap-2">
        {/* Product Name: slightly larger, lighter gray, clear font */}
        <h3 className="text-[14px] font-sfu-book text-gray-600 truncate leading-normal">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-3">
          <p className="text-[14px] font-sfu-book text-black font-medium">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price).replace('₫', '')} ₫
          </p>
          {product.originalPrice && (
            <p className="text-[14px] text-gray-400 line-through decoration-gray-400 font-sfu-book font-light">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice).replace('₫', '')} ₫
            </p>
          )}
        </div>
        
        {/* Color Swatches: Slightly larger, with clear gap */}
        {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2.5 mt-1">
                {product.colors.map((color, idx) => (
                    <div 
                        key={idx}
                        className={`w-4 h-4 rounded-full border border-gray-200 cursor-pointer relative hover:scale-110 transition-transform duration-200`}
                        style={{ backgroundColor: color }}
                    >
                        {/* Inner ring for white colors to be visible against white background */}
                         {color.toLowerCase() === '#ffffff' && (
                             <div className="absolute inset-0 rounded-full border border-gray-100"></div>
                         )}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;