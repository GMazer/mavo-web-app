
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: () => void; // Optional click handler for navigation
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  // Determine Primary and Secondary images
  const primaryImage = product.images?.[0] || product.image;
  const secondaryImage = product.images?.[1];

  return (
    <div className="group cursor-pointer block" onClick={onClick}>
      {/* Aspect Ratio 2/3 for tall fashion images */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
        
        {/* Primary Image (Always visible initially) */}
        <img
          src={primaryImage}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out z-10"
        />

        {/* Secondary Image (Visible on hover with fade effect) */}
        {secondaryImage && (
            <img 
                src={secondaryImage}
                alt={`${product.name} alternate`}
                className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-20"
            />
        )}
        
        {/* MUA NGAY Button - Slides up on hover - Z-Index needs to be higher than images */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-30">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                }}
                className="w-full bg-white text-black font-bold text-[11px] py-3 uppercase tracking-wider hover:bg-gray-50 shadow-md border border-transparent hover:border-gray-200"
            >
                Mua ngay
            </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-4 flex flex-col gap-1.5">
        <h3 className="text-sm text-gray-700 truncate leading-normal hover:text-black transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <p className="text-sm text-black font-normal">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price).replace('₫', '')} ₫
          </p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through decoration-gray-400 font-light">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice).replace('₫', '')} ₫
            </p>
          )}
        </div>
        
        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 mt-2">
                {product.colors.map((color, idx) => {
                    // Safety check for legacy data if exists, though seed data is updated
                    const hex = typeof color === 'string' ? color : color.hex;
                    const name = typeof color === 'string' ? color : color.name;
                    return (
                        <div 
                            key={idx}
                            title={name}
                            // Outer Ring
                            className="w-5 h-5 rounded-full border border-gray-300 p-[2px] cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-center"
                        >
                            {/* Inner Color Circle */}
                            <div 
                                className="w-full h-full rounded-full"
                                style={{ 
                                    backgroundColor: hex,
                                    border: hex.toLowerCase() === '#ffffff' ? '1px solid #e5e7eb' : 'none'
                                }}
                            >
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
