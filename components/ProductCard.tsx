import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        {product.originalPrice && (
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
        )}
      </div>
      <div className="space-y-1">
        {/* Product Name using sfu-light */}
        <h3 className="text-[13px] font-sfu-light text-gray-700 truncate leading-tight">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          {/* Price using sfu-book */}
          <p className="text-[13px] font-sfu-book font-bold text-gray-900">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price).replace('₫', '')} ₫
          </p>
          {product.originalPrice && (
            <p className="text-[12px] text-gray-400 line-through decoration-gray-400 font-sfu-book">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice).replace('₫', '')} ₫
            </p>
          )}
        </div>
        
        {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 mt-2">
                {product.colors.map((color, idx) => (
                    <div 
                        key={idx}
                        className={`w-3 h-3 rounded-full ring-1 ring-gray-300 ring-offset-2 transition-all duration-300 hover:scale-110 hover:ring-gray-400 ${color.toLowerCase() === '#ffffff' ? 'border border-gray-200' : ''}`}
                        style={{ backgroundColor: color }}
                    ></div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;