import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { StarIcon } from '@heroicons/react/20/solid';
import { 
    TruckIcon, 
    CreditCardIcon, 
    PhoneIcon, 
    ArrowPathIcon,
    ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/products';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, size: string) => void;
  onRelatedClick: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onRelatedClick }) => {
  // Determine images to show (fallback to single image if array is missing)
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  
  const [activeImage, setActiveImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Reset state when product changes
  useEffect(() => {
    setActiveImage(images[0]);
    setQuantity(1);
    setSelectedSize(null);
    window.scrollTo(0, 0);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
        alert("Vui lòng chọn kích thước!");
        return;
    }
    onAddToCart(product, quantity, selectedSize);
  };

  // Mock "Related Products" - just take 4 items excluding current
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-3/5 flex gap-4">
          {/* Thumbnail Strip (Left side) */}
          <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`cursor-pointer border ${activeImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                onMouseEnter={() => setActiveImage(img)}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full aspect-[3/4] object-cover" />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <img src={activeImage} alt={product.name} className="w-full h-auto object-cover aspect-[3/4]" />
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="w-full lg:w-2/5 flex flex-col">
          <h1 className="text-2xl lg:text-[28px] font-normal mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <span>Mã sản phẩm: {product.code || 'N/A'}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-6">
            {[0, 1, 2, 3, 4].map((star) => (
               <StarIcon key={star} className="w-4 h-4 text-gray-200" />
            ))}
            <span className="text-sm text-gray-400 ml-1">(0)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-8">
             <span className="text-2xl font-bold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price).replace('₫', '')} ₫
             </span>
             {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through decoration-gray-400">
                     {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice).replace('₫', '')} ₫
                </span>
             )}
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <p className="text-sm mb-2">Màu sắc: <span className="font-bold">Màu Nâu</span></p>
            <div className="flex gap-3">
                {product.colors?.map((color, idx) => (
                    <div key={idx} className={`w-8 h-8 rounded-full border-2 ${idx === 0 ? 'border-black' : 'border-transparent'} p-0.5 cursor-pointer`}>
                        <div className="w-full h-full rounded-full border border-gray-200" style={{ backgroundColor: color }}></div>
                    </div>
                ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <p className="text-sm mb-2">Kích thước:</p>
            <div className="flex gap-2">
                {['S', 'M', 'L'].map((size) => (
                    <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors
                            ${selectedSize === size 
                                ? 'bg-black text-white border-black' 
                                : 'bg-white text-black border-gray-300 hover:border-black'
                            }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
             {/* Quantity Input */}
             <div className="flex items-center border border-gray-300 w-32 h-12">
                <button 
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                    –
                </button>
                <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    className="w-full h-full text-center text-sm font-medium focus:outline-none" 
                />
                <button 
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black"
                    onClick={() => setQuantity(quantity + 1)}
                >
                    +
                </button>
             </div>

             {/* Add Button */}
             <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white h-12 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
             >
                THÊM VÀO GIỎ HÀNG
             </button>
          </div>

          {/* Chat Support */}
          <a href="#" className="flex items-center gap-2 text-[#0084FF] text-sm mb-8 hover:underline">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Facebook_Messenger_logo_2018.svg/2048px-Facebook_Messenger_logo_2018.svg.png" className="w-5 h-5" alt="Messenger" />
             Chat để được DMC tư vấn ngay (08:30 - 17:00)
          </a>

          {/* Service Info Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-gray-50 p-6 rounded-sm">
             <div className="flex items-start gap-3">
                <TruckIcon className="w-6 h-6 flex-shrink-0 stroke-1" />
                <div className="text-xs">
                    <p className="font-bold mb-1">Giao hỏa tốc toàn quốc đồng giá ship 30.000đ</p>
                    <p className="text-gray-500">Nội thành Hà Nội nhận hàng trong 1-2 ngày</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    <span className="text-lg font-light">🌐</span>
                </div>
                <div className="text-xs">
                    <p className="font-bold mb-1">Khu vực Tỉnh thành nhận hàng từ 3 đến 5 ngày trong tuần.</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <CreditCardIcon className="w-6 h-6 flex-shrink-0 stroke-1" />
                <div className="text-xs">
                    <p className="font-bold mb-1">Thanh toán Online cực dễ qua cổng Payoo</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <ArrowPathIcon className="w-6 h-6 flex-shrink-0 stroke-1" />
                <div className="text-xs">
                    <p className="font-bold mb-1">6 ngày đổi hàng khi mua tại Showroom, 15 ngày khi mua Online</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <PhoneIcon className="w-6 h-6 flex-shrink-0 stroke-1" />
                <div className="text-xs">
                    <p className="font-bold mb-1">Hotline <span className="font-extrabold">1800 6525</span> hỗ trợ hành chính từ 8h30 - 17h mỗi ngày (T2-CN)</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                     <TruckIcon className="w-6 h-6 stroke-1 scale-x-[-1]" />
                </div>
                <div className="text-xs">
                    <p className="font-bold mb-1">Giao hàng tận nơi, hoàn tiền thứ 5 hàng tuần</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Highlights & Related */}
      <div className="mt-16 border-t border-gray-200 pt-8">
        <h3 className="text-sm font-bold uppercase mb-4">ĐẶC ĐIỂM NỔI BẬT</h3>
        <div className="prose max-w-none text-sm text-gray-600">
             <p>{product.description}</p>
             <p className="mt-2">- Chất liệu cao cấp, thoáng mát.</p>
             <p>- Thiết kế hiện đại, phù hợp nhiều hoàn cảnh.</p>
             <p>- Hướng dẫn bảo quản: Giặt tay hoặc giặt máy chế độ nhẹ, không dùng thuốc tẩy mạnh.</p>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-base font-normal uppercase mb-6 tracking-wide">SẢN PHẨM MUA CÙNG</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
            {relatedProducts.map(rp => (
                <ProductCard 
                    key={rp.id} 
                    product={rp} 
                    onAddToCart={(p) => onAddToCart(p, 1, 'M')} 
                    onClick={() => onRelatedClick(rp)}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;