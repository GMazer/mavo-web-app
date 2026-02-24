
import React, { useState, useEffect } from 'react';
import { Product, AppSettings, ProductColor } from '../types';
import { StarIcon } from '@heroicons/react/20/solid';
import { 
    TruckIcon, 
    CreditCardIcon, 
    PhoneIcon, 
    ArrowPathIcon, 
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

// Import sub-components
import ProductGallery from './product/ProductGallery';
import ProductReviews from './product/ProductReviews';
import ProductTabs from './product/ProductTabs';
import RelatedProducts from './product/RelatedProducts';

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
  const { t } = useLanguage();
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  
  // Stats passed up from Review Component
  const [ratingStats, setRatingStats] = useState({ avg: 0, count: 0 });

  const [expandHighlights, setExpandHighlights] = useState(true);
  const [expandBoughtTogether, setExpandBoughtTogether] = useState(true);

  useEffect(() => {
    setQuantity(1);
    setSelectedSize(null);
    setExpandHighlights(true);
    setExpandBoughtTogether(true);
    setRatingStats({ avg: 0, count: 0 }); // Reset stats for new product

    window.scrollTo(0, 0);

    // Set default selected color
    if (product.colors && product.colors.length > 0) {
        const firstColor = product.colors[0];
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
        toast.error(t('detail.select_size_error'));
        return;
    }
    onAddToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
        toast.error(t('detail.select_size_error'));
        return;
    }
    onBuyNow(product, quantity, selectedSize);
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);
  
  // Suggest products from the same category first, then fallback to other products
  const boughtTogetherProducts = React.useMemo(() => {
    const sameCategory = allProducts.filter(p => p.id !== product.id && p.category === product.category);
    const otherProducts = allProducts.filter(p => p.id !== product.id && p.category !== product.category);
    
    // Shuffle the arrays to make suggestions dynamic
    const shuffle = (array: Product[]) => [...array].sort(() => 0.5 - Math.random());
    
    const suggestions = [...shuffle(sameCategory), ...shuffle(otherProducts)];
    return suggestions.slice(0, 4);
  }, [product.id, product.category, allProducts]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Image Gallery (Extracted) */}
        <ProductGallery images={images} productName={product.name} />

        {/* Right Column: Details */}
        <div className="w-full lg:w-2/5 flex flex-col">
          <h1 className="text-2xl lg:text-[28px] font-normal mb-2 truncate" title={product.name}>{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <span>{t('detail.code')} {product.code || 'N/A'}</span>
          </div>

          <div className="flex items-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
               <StarIcon key={star} className={`w-4 h-4 ${star <= Math.round(ratingStats.avg) ? 'text-yellow-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-sm text-gray-400 ml-1">({ratingStats.count})</span>
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
            <p className="text-sm mb-2">{t('detail.color')}: <span className="font-bold">{selectedColor ? selectedColor.name : ''}</span></p>
            <div className="flex gap-3">
                {product.colors?.map((color, idx) => {
                    const hex = typeof color === 'string' ? color : color.hex;
                    const name = typeof color === 'string' ? color : color.name;
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
            <p className="text-sm mb-2">{t('detail.size')}:</p>
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
                    {t('detail.addtocart')}
                 </button>
                 <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-black text-white h-12 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                 >
                    {t('detail.buynow')}
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
                {t('detail.highlights')}
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${expandHighlights ? 'rotate-180' : ''}`} />
             </button>
             <div className={`overflow-hidden transition-all duration-300 ${expandHighlights ? 'max-h-96 mt-4' : 'max-h-0'}`}>
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
                {t('detail.youmaylike')}
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

      {/* Info Tabs (Extracted) */}
      <ProductTabs product={product} settings={settings} />

      {/* Reviews (Extracted) */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <ProductReviews 
            productId={product.id} 
            onRatingUpdate={(avg, count) => setRatingStats({ avg, count })}
          />
      </div>

      {/* Related Products (Extracted) */}
      <RelatedProducts 
        products={relatedProducts} 
        onRelatedClick={onRelatedClick}
        onAddToCart={(p) => onAddToCart(p, 1, 'M')}
      />
    </div>
  );
};

export default ProductDetail;
