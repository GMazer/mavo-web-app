
import React, { useState, useEffect } from 'react';
import { Product, AppSettings, ProductColor } from '../types';
import ProductCard from './ProductCard';
import { StarIcon } from '@heroicons/react/20/solid';
import { 
    TruckIcon, 
    CreditCardIcon, 
    PhoneIcon, 
    ArrowPathIcon, 
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  settings: AppSettings;
  onAddToCart: (product: Product, quantity: number, size: string) => void;
  onBuyNow: (product: Product, quantity: number, size: string) => void;
  onRelatedClick: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, allProducts, settings, onAddToCart, onBuyNow, onRelatedClick }) => {
  const toast = useToast();
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  // State for selected color
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

  const [activeTab, setActiveTab] = useState<'info' | 'care' | 'policy'>('info');
  const [expandHighlights, setExpandHighlights] = useState(false);
  const [expandBoughtTogether, setExpandBoughtTogether] = useState(false);

  // Determine Size Guide Image
  const sizeGuideImage = product.customSizeGuide || settings.sizeGuideDefault || 'https://via.placeholder.com/800x500?text=Size+Guide+Pending';
  // Determine Care Guide Image
  const careGuideImage = settings.careGuideDefault || 'https://via.placeholder.com/800x500?text=Care+Guide+Pending';
  // Determine Return Policy Image
  const returnPolicyImage = settings.returnPolicyDefault || 'https://via.placeholder.com/800x500?text=Policy+Pending';

  useEffect(() => {
    if (images.length <= 1 || isHovering) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [images.length, isHovering]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setQuantity(1);
    setSelectedSize(null);
    setActiveTab('info');
    setExpandHighlights(false);
    setExpandBoughtTogether(false);
    window.scrollTo(0, 0);

    // Set default selected color to the first one available
    if (product.colors && product.colors.length > 0) {
        const firstColor = product.colors[0];
        // Handle legacy string data if necessary, though type suggests object
        if (typeof firstColor === 'string') {
            setSelectedColor({ name: firstColor, hex: firstColor });
        } else {
            setSelectedColor(firstColor);
        }
    } else {
        setSelectedColor(null);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
        toast.error("Vui lòng chọn kích thước!");
        return;
    }
    // Logic could be extended to include selectedColor in the cart item
    onAddToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
        toast.error("Vui lòng chọn kích thước!");
        return;
    }
    onBuyNow(product, quantity, selectedSize);
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);
  const boughtTogetherProducts = allProducts.filter(p => p.id !== product.id).slice(4, 8);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-3/5 flex gap-4">
          <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`cursor-pointer border transition-all duration-300 ${currentImageIndex === idx ? 'border-black opacity-100' : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100'}`}
                onMouseEnter={() => setCurrentImageIndex(idx)}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full aspect-[3/4] object-cover" />
              </div>
            ))}
          </div>

          <div 
            className="flex-1 relative aspect-[3/4] overflow-hidden bg-gray-100"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {images.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${product.name} - View ${idx + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="w-full lg:w-2/5 flex flex-col">
          <h1 className="text-2xl lg:text-[28px] font-normal mb-2 truncate" title={product.name}>{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <span>Mã sản phẩm: {product.code || 'N/A'}</span>
          </div>

          <div className="flex items-center gap-1 mb-6">
            {[0, 1, 2, 3, 4].map((star) => (
               <StarIcon key={star} className="w-4 h-4 text-gray-200" />
            ))}
            <span className="text-sm text-gray-400 ml-1">(0)</span>
          </div>

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

          <div className="mb-6">
            <p className="text-sm mb-2">Màu sắc: <span className="font-bold">{selectedColor ? selectedColor.name : 'Chưa chọn'}</span></p>
            <div className="flex gap-3">
                {product.colors?.map((color, idx) => {
                    // Safe handling for string vs object types
                    const hex = typeof color === 'string' ? color : color.hex;
                    const name = typeof color === 'string' ? color : color.name;
                    
                    // Check if this color is the currently selected one
                    const isSelected = selectedColor && selectedColor.hex === hex;

                    return (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedColor({ name, hex })}
                            className={`w-8 h-8 rounded-full border-2 p-0.5 cursor-pointer transition-all duration-200 
                                ${isSelected ? 'border-black scale-110' : 'border-transparent hover:border-gray-300'}`} 
                            title={name}
                        >
                            <div 
                                className="w-full h-full rounded-full border border-gray-200 shadow-sm" 
                                style={{ backgroundColor: hex }}
                            ></div>
                        </div>
                    );
                })}
            </div>
        </div>

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

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
             <div className="flex items-center border border-gray-300 w-32 h-12 flex-shrink-0 bg-white">
                <button 
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                    –
                </button>
                <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    className="flex-1 w-0 h-full text-center text-sm font-medium focus:outline-none bg-transparent text-black" 
                />
                <button 
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                >
                    +
                </button>
             </div>

             <div className="flex-1 flex gap-2">
                 <button 
                    onClick={handleAddToCart}
                    className="flex-1 border border-black bg-white text-black h-12 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                 >
                    Thêm vào giỏ
                 </button>
                 <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-black text-white h-12 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                 >
                    Mua ngay
                 </button>
             </div>
          </div>

          <a href="#" className="flex items-center gap-2 text-[#0084FF] text-sm mb-8 hover:underline">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Facebook_Messenger_logo_2018.svg/2048px-Facebook_Messenger_logo_2018.svg.png" className="w-5 h-5" alt="Messenger" />
             Chat để được MAVO tư vấn ngay (08:30 - 17:00)
          </a>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-gray-50 p-6 rounded-sm mb-6">
             <div className="flex items-start gap-3">
                <TruckIcon className="w-6 h-6 flex-shrink-0 stroke-1" />
                <div className="text-xs">
                    <p className="font-light mb-1">Giao hỏa tốc toàn quốc đồng giá ship 30.000đ</p>
                    <p className="text-gray-500">Nội thành Hà Nội nhận hàng trong 1-2 ngày</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    <span className="text-lg font-light">🌐</span>
                </div>
                <div className="text-xs">
                    <p className="font-light mb-1">Khu vực Tỉnh thành nhận hàng từ 3 đến 5 ngày trong tuần.</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <CreditCardIcon className="w-6 h-6 flex-shrink-0 stroke-1" />
                <div className="text-xs">
                    <p className="font-light mb-1">Thanh toán Online cực dễ qua cổng Payoo</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <ArrowPathIcon className="w-6 h-6 flex-shrink-0 stroke-1" />
                <div className="text-xs">
                    <p className="font-light mb-1">6 ngày đổi hàng khi mua tại Showroom, 15 ngày khi mua Online</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <PhoneIcon className="w-6 h-6 flex-shrink-0 stroke-1" />
                <div className="text-xs">
                    <p className="font-light mb-1">Hotline <span className="font-extrabold">{settings.hotline}</span> hỗ trợ hành chính từ 8h30 - 17h mỗi ngày (T2-CN)</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                     <TruckIcon className="w-6 h-6 stroke-1 scale-x-[-1]" />
                </div>
                <div className="text-xs">
                    <p className="font-light mb-1">Giao hàng tận nơi, hoàn tiền thứ 5 hàng tuần</p>
                </div>
             </div>
          </div>

          <div className="border-t border-gray-200 py-4">
             <button 
                className="flex w-full justify-between items-center text-sm font-medium uppercase hover:text-gray-600 transition-colors"
                onClick={() => setExpandHighlights(!expandHighlights)}
             >
                ĐẶC ĐIỂM NỔI BẬT
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${expandHighlights ? 'rotate-180' : ''}`} />
             </button>
             <div className={`overflow-hidden transition-all duration-300 ${expandHighlights ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                {/* Dynamically display highlights */}
                <p className="text-sm text-gray-600 font-light leading-relaxed whitespace-pre-line">
                    {product.highlights || 'Chất liệu cao cấp, thiết kế hiện đại phù hợp với nhiều phong cách.'}
                </p>
             </div>
          </div>

          <div className="border-t border-gray-200 py-4 border-b">
             <button 
                className="flex w-full justify-between items-center text-sm font-medium uppercase hover:text-gray-600 transition-colors"
                onClick={() => setExpandBoughtTogether(!expandBoughtTogether)}
             >
                SẢN PHẨM MUA CÙNG
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${expandBoughtTogether ? 'rotate-180' : ''}`} />
             </button>
             <div className={`overflow-hidden transition-all duration-300 ${expandBoughtTogether ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                  {boughtTogetherProducts.length > 0 ? (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {boughtTogetherProducts.map(p => (
                            <div key={p.id} className="w-20 flex-shrink-0 cursor-pointer group" onClick={() => onRelatedClick(p)}>
                                <img src={p.image} className="w-full aspect-[2/3] object-cover mb-2 border border-transparent group-hover:border-black" />
                                <p className="text-[10px] line-clamp-2 leading-tight">{p.name}</p>
                                <p className="text-[10px] font-bold mt-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price).replace('₫', '')}₫</p>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <p className="text-xs text-gray-400 py-2">Chưa có sản phẩm gợi ý.</p>
                  )}
             </div>
          </div>

        </div>
      </div>

      <div className="mt-20 w-full px-6 lg:px-[260px]">
        <div className="flex flex-wrap gap-8 border-b border-gray-200 mb-8">
            <button 
                onClick={() => setActiveTab('info')}
                className={`text-sm uppercase pb-3 border-b-2 transition-colors ${activeTab === 'info' ? 'border-black font-bold text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
            >
                Thông tin sản phẩm
            </button>
            <button 
                onClick={() => setActiveTab('care')}
                className={`text-sm uppercase pb-3 border-b-2 transition-colors ${activeTab === 'care' ? 'border-black font-bold text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
            >
                Hướng dẫn bảo quản
            </button>
            <button 
                onClick={() => setActiveTab('policy')}
                className={`text-sm uppercase pb-3 border-b-2 transition-colors ${activeTab === 'policy' ? 'border-black font-bold text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
            >
                Chính sách đổi hàng
            </button>
        </div>

        <div className="mb-16">
            {activeTab === 'info' && (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-light uppercase mb-6">THÔNG TIN SẢN PHẨM</h3>
                    <div className="text-sm font-light text-gray-700 space-y-2 mb-10">
                        <p>Sản phẩm: {product.name}</p>
                        {/* Dynamic fields */}
                        <p>Chất Vải: {product.material || "Vải dệt thoi"}</p>
                        <p>Dòng sản phẩm: {product.gender || "FEMALE"}</p>
                        
                        {/* Dynamic Description Block */}
                        <p className="leading-relaxed whitespace-pre-line">
                            {product.description || `Thổi hồn vào những thiết kế MAVO đem đến cho bạn trải nghiệm dòng sản phẩm với phong cách trẻ trung, năng động và hiện đại. \nMAVO By DO MANH CUONG`}
                        </p>
                    </div>
                    {/* Size Guide */}
                    <div className="w-full bg-white p-4 flex justify-center border border-gray-100 rounded">
                        <img 
                            src={sizeGuideImage} 
                            alt="Bang size ao" 
                            className="max-w-full h-auto object-contain max-h-[600px]"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=Size+Guide+Not+Available';
                            }}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'care' && (
                <div className="animate-fade-in flex justify-center py-10">
                     <img 
                        src={careGuideImage} 
                        alt="Huong dan bao quan"
                        className="max-w-[800px] w-full h-auto"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=Care+Guide+Not+Available';
                        }}
                     />
                </div>
            )}

            {activeTab === 'policy' && (
                 <div className="animate-fade-in flex justify-center py-10">
                    <img 
                       src={returnPolicyImage} 
                       alt="Chinh sach doi hang"
                       className="max-w-[800px] w-full h-auto"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=Policy+Not+Available';
                        }}
                    />
               </div>
            )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="border border-gray-200 p-6 lg:p-10 bg-white">
            <h3 className="text-sm font-bold uppercase mb-6">ĐÁNH GIÁ SẢN PHẨM</h3>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                <div className="flex flex-col items-center justify-center min-w-[150px]">
                    <span className="text-6xl font-light">0</span>
                    <div className="flex gap-1 my-2">
                        {[1,2,3,4,5].map(s => <StarIcon key={s} className="w-4 h-4 text-gray-200" />)}
                    </div>
                    <span className="text-gray-400 text-sm">Chưa có đánh giá nào</span>
                </div>
                <div className="flex-1 w-full">
                    <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">Đánh giá của bạn:</label>
                        <div className="flex gap-1">
                             {[1,2,3,4,5].map(s => <StarIcon key={s} className="w-5 h-5 text-gray-200 cursor-pointer hover:text-yellow-400 transition-colors" />)}
                        </div>
                    </div>
                    <div className="mb-4">
                         <label className="block text-sm text-gray-500 mb-2">Nhận xét của bạn:</label>
                         <textarea 
                            className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors min-h-[100px] bg-white"
                            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                         ></textarea>
                    </div>
                    <button className="bg-[#333] text-white text-xs font-bold uppercase px-6 py-3 hover:bg-black transition-colors">
                        GỬI ĐÁNH GIÁ
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-20">
        <h3 className="text-base font-normal uppercase mb-6 tracking-wide">CÓ THỂ BẠN SẼ THÍCH</h3>
        {relatedProducts.length > 0 ? (
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
        ) : (
            <p className="text-center text-gray-400">Không có sản phẩm liên quan.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
