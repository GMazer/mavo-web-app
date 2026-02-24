
import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Spinner } from '../admin-app/components/ui/Icons';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import SearchableSelect from './ui/SearchableSelect';

// --- CONFIG API ---
const API_BASE = 'https://mavo-fashion-api.mavo-web.workers.dev/api';

// Simplified Types for API Response
interface LocationItem {
    code: string;
    name: string;
    name_with_type: string;
}

interface CheckoutProps {
  cartItems: CartItem[];
  onPlaceOrder: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder }) => {
  const toast = useToast();
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod'>('bank');
  const [submitting, setSubmitting] = useState(false);
  
  // --- Dynamic Location State ---
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [wards, setWards] = useState<LocationItem[]>([]);
  
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      addressDetail: '',
      city: '', 
      cityCode: '',
      district: '',
      districtCode: '',
      ward: '',
      wardCode: '',
      note: ''
  });

  // 1. Fetch Provinces on Mount
  useEffect(() => {
      fetch(`${API_BASE}/locations/provinces`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setProvinces(data);
        })
        .catch(err => console.error("Error fetching provinces:", err));
  }, []);

  // 2. Handle City Change -> Fetch Districts
  const handleCityChange = async (code: string) => {
      const city = provinces.find(p => p.code === code);
      
      setFormData(prev => ({
          ...prev,
          cityCode: code,
          city: city ? city.name_with_type : '',
          district: '', districtCode: '',
          ward: '', wardCode: ''
      }));
      setDistricts([]);
      setWards([]);

      if (code) {
          setLoadingDistricts(true);
          try {
              const res = await fetch(`${API_BASE}/locations/districts/${code}`);
              const data = await res.json();
              if (Array.isArray(data)) setDistricts(data);
          } catch (err) {
              console.error(err);
          } finally {
              setLoadingDistricts(false);
          }
      }
  };

  // 3. Handle District Change -> Fetch Wards
  const handleDistrictChange = async (code: string) => {
      const district = districts.find(d => d.code === code);

      setFormData(prev => ({
          ...prev,
          districtCode: code,
          district: district ? district.name_with_type : '',
          ward: '', wardCode: ''
      }));
      setWards([]);

      if (code) {
          setLoadingWards(true);
          try {
              const res = await fetch(`${API_BASE}/locations/wards/${code}`);
              const data = await res.json();
              if (Array.isArray(data)) setWards(data);
          } catch (err) {
              console.error(err);
          } finally {
              setLoadingWards(false);
          }
      }
  };

  // 4. Handle Ward Change
  const handleWardChange = (code: string) => {
      const ward = wards.find(w => w.code === code);
      
      setFormData(prev => ({
          ...prev,
          wardCode: code,
          ward: ward ? ward.name_with_type : ''
      }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
      // Validation
      if (!formData.firstName || !formData.phone || !formData.addressDetail || !formData.city || !formData.district || !formData.ward) {
          toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
          return;
      }

      setSubmitting(true);
      
      const payload = {
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          customerPhone: formData.phone,
          customerEmail: formData.email,
          addressDetail: formData.addressDetail,
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
          note: formData.note,
          totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
          paymentMethod: paymentMethod === 'bank' ? 'Chuyển khoản' : 'COD',
          items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.selectedSize,
              color: item.colors?.[0]?.name || 'N/A'
          }))
      };

      try {
          const res = await fetch(`${API_BASE}/orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (res.ok) {
              onPlaceOrder(); 
          } else {
              const err = await res.json();
              toast.error(`Đặt hàng thất bại: ${err.error || 'Lỗi không xác định'}`);
          }
      } catch (error) {
          console.error(error);
          toast.error("Lỗi kết nối đến máy chủ.");
      } finally {
          setSubmitting(false);
      }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal; 

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10 animate-fade-in">
      
      {/* Success/Notification Banner */}
      {cartItems.length > 0 && (
          <div className="bg-[#fcfcfc] border border-gray-200 p-4 mb-8 flex items-center gap-2 text-sm text-gray-600">
             <CheckCircleIcon className="w-5 h-5 text-green-600" />
             <span className="font-medium">"{cartItems[cartItems.length-1].name}" đã được thêm vào giỏ hàng.</span>
          </div>
      )}

      {/* Coupon Trigger */}
      <div className="mb-10 text-sm">
         Bạn có mã ưu đãi? <span className="font-bold underline cursor-pointer hover:text-gray-600">Ấn vào đây để nhập mã</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* LEFT COLUMN: Billing Details */}
        <div className="flex-1">
            <h2 className="text-2xl font-normal uppercase mb-6 border-b border-gray-200 pb-2">{t('checkout.shipping_info')}</h2>
            
            <form className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('checkout.fullname')} *</label>
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('checkout.phone')} *</label>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Địa chỉ Email</label>
                        <input name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors" />
                    </div>
                </div>

                {/* --- LOCATION SELECTORS (SEARCHABLE) --- */}
                <div>
                    <SearchableSelect 
                        label="Tỉnh / Thành phố *"
                        placeholder="Chọn Tỉnh / Thành phố..."
                        options={provinces}
                        value={formData.cityCode}
                        onChange={handleCityChange}
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                     <div className="flex-1">
                        <SearchableSelect 
                            label="Quận / Huyện *"
                            placeholder={loadingDistricts ? "Đang tải..." : "Chọn Quận / Huyện..."}
                            options={districts}
                            value={formData.districtCode}
                            onChange={handleDistrictChange}
                            disabled={!formData.cityCode || loadingDistricts}
                            loading={loadingDistricts}
                        />
                    </div>
                    <div className="flex-1">
                        <SearchableSelect 
                            label="Phường / Xã *"
                            placeholder={loadingWards ? "Đang tải..." : "Chọn Phường / Xã..."}
                            options={wards}
                            value={formData.wardCode}
                            onChange={handleWardChange}
                            disabled={!formData.districtCode || loadingWards}
                            loading={loadingWards}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('checkout.address')} *</label>
                    <input name="addressDetail" value={formData.addressDetail} onChange={handleInputChange} type="text" className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors" placeholder="Ví dụ: Số 10, Ngõ 123 Đường ABC" />
                </div>

                <div className="pt-8">
                    <h3 className="text-xl font-normal uppercase mb-4">Thông tin bổ sung</h3>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('checkout.notes')}</label>
                    <textarea 
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 bg-[#f9f9f9] p-4 text-sm outline-none focus:border-black rounded-none transition-colors min-h-[120px]"
                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    ></textarea>
                </div>
            </form>
        </div>

        {/* RIGHT COLUMN: Order Summary (Unchanged) */}
        <div className="w-full lg:w-[450px] flex-shrink-0">
            <div className="border-2 border-dashed border-gray-800 p-8 bg-[#fffcf5]">
                <h2 className="text-xl font-normal uppercase text-center mb-8 tracking-wide">{t('checkout.your_order')}</h2>
                
                <div className="flex justify-between text-xs font-bold uppercase border-b-2 border-gray-200 pb-3 mb-4 text-gray-500">
                    <span>Sản phẩm</span>
                    <span>{t('checkout.subtotal')}</span>
                </div>

                {/* Product List */}
                <div className="space-y-4 mb-6 border-b border-gray-200 pb-6 max-h-80 overflow-y-auto">
                    {cartItems.map((item, idx) => {
                         const colorName = item.colors && item.colors.length > 0 
                            ? (typeof item.colors[0] === 'string' ? item.colors[0] : item.colors[0].name)
                            : 'N/A';

                        return (
                            <div key={`${item.id}-${item.selectedSize}-${idx}`} className="flex justify-between items-start text-sm">
                                <div className="flex items-start pr-4">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-12 h-16 object-cover mr-3 border border-gray-200 flex-shrink-0"
                                    />
                                    <div>
                                        <div>
                                            <span className="text-gray-600 line-clamp-1">{item.name}</span> 
                                            <strong className="ml-1">× {item.quantity}</strong>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            Màu: {colorName} | Size: {item.selectedSize}
                                        </div>
                                    </div>
                                </div>
                                <span className="font-bold whitespace-nowrap">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity).replace('₫', '')}₫
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Totals */}
                <div className="flex justify-between items-center text-sm mb-4">
                    <span className="font-bold">{t('checkout.subtotal')}</span>
                    <span className="font-bold text-[#E71313]">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal).replace('₫', '')}₫
                    </span>
                </div>
                <div className="flex justify-between items-center text-lg mb-8 border-b-2 border-gray-200 pb-6">
                    <span className="font-bold">{t('checkout.total')}</span>
                    <span className="font-bold text-[#E71313]">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total).replace('₫', '')}₫
                    </span>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                        <input 
                            type="radio" 
                            name="payment" 
                            id="bank" 
                            checked={paymentMethod === 'bank'}
                            onChange={() => setPaymentMethod('bank')}
                            className="mt-1"
                        />
                        <div>
                            <label htmlFor="bank" className="font-bold text-sm cursor-pointer">{t('checkout.bank')}</label>
                            {paymentMethod === 'bank' && (
                                <div className="text-xs text-gray-500 mt-2 p-3 bg-white border border-gray-200">
                                    Thông tin hướng dẫn chuyển khoản sẽ được hiện khi bạn đặt hàng thành công. Vui lòng làm theo hướng dẫn sau đó để Mavo tiếp tục xử lý đơn hàng của bạn.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input 
                            type="radio" 
                            name="payment" 
                            id="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="mt-0.5"
                        />
                        <label htmlFor="cod" className="font-bold text-sm cursor-pointer">{t('checkout.cod')}</label>
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={submitting || cartItems.length === 0}
                    className="w-full bg-black text-white h-14 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-none disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                    {submitting ? 'Đang xử lý...' : t('checkout.place_order')}
                </button>

                <div className="mt-6 text-[11px] text-gray-500 text-center leading-relaxed">
                    Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng của bạn, hỗ trợ trải nghiệm của bạn trên toàn bộ trang web này và cho các mục đích khác được mô tả trong <a href="#" className="underline">Chính sách bảo mật</a>.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
