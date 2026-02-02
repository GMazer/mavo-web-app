import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group cursor-pointer block">
      {/* Aspect Ratio 2/3 for tall fashion images */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
        
        {/* Sale tag hidden to match Image 2 reference style perfectly. 
            Uncomment below to restore.
        */}
        {/* 
        {product.originalPrice && (
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 z-10">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
        )} 
        */}
        
        {/* MUA NGAY Button - Slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                }}
                className="w-full bg-white text-black font-bold text-[11px] py-3 uppercase tracking-wider hover:bg-gray-50 shadow-md font-sfu-book border border-transparent hover:border-gray-200"
            >
                Mua ngay
            </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-4 flex flex-col gap-1.5">
        {/* Product Name: Clean, light/regular font, left aligned */}
        <h3 className="text-[13px] font-sfu-book text-gray-700 truncate leading-normal">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <p className="text-[13px] font-sfu-book text-black font-normal">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price).replace('₫', '')} ₫
          </p>
          {product.originalPrice && (
            <p className="text-[13px] text-gray-400 line-through decoration-gray-400 font-sfu-book font-light">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice).replace('₫', '')} ₫
            </p>
          )}
        </div>
        
        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 mt-1">
                {product.colors.map((color, idx) => (
                    <div 
                        key={idx}
                        className={`w-3.5 h-3.5 rounded-full border border-gray-300 cursor-pointer relative hover:border-gray-400 transition-colors`}
                        style={{ backgroundColor: color }}
                    >
                        {/* Inner ring for white colors */}
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