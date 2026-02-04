
import React, { useState } from 'react';
import { CartItem } from '../types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface CheckoutProps {
  cartItems: CartItem[];
  onPlaceOrder: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder }) => {
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod'>('bank');
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal; // Add shipping logic here if needed

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10 animate-fade-in">
      
      {/* Success/Notification Banner mimicking the reference */}
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
            <h2 className="text-2xl font-normal uppercase mb-6 border-b border-gray-200 pb-2">Thông tin thanh toán</h2>
            
            <form className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Tên *</label>
                        <input type="text" className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors" placeholder="" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Họ *</label>
                        <input type="text" className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors" placeholder="" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Quốc gia/Khu vực *</label>
                    <select className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors appearance-none">
                        <option>Việt Nam</option>
                    </select>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                     <div className="flex-1">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Tỉnh thành *</label>
                        <select className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors">
                            <option>Hà Nội</option>
                            <option>Hồ Chí Minh</option>
                            <option>Đà Nẵng</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Quận huyện *</label>
                        <select className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors">
                            <option>Chọn một tùy chọn...</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Địa chỉ *</label>
                    <input type="text" className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors" placeholder="Địa chỉ" />
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Số điện thoại *</label>
                        <input type="tel" className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Địa chỉ Email *</label>
                        <input type="email" className="w-full h-12 border border-gray-200 bg-[#f9f9f9] px-4 text-sm outline-none focus:border-black rounded-none transition-colors" />
                    </div>
                </div>

                <div className="pt-8">
                    <h3 className="text-xl font-normal uppercase mb-4">Thông tin bổ sung</h3>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Ghi chú đơn hàng (tuỳ chọn)</label>
                    <textarea 
                        className="w-full border border-gray-200 bg-[#f9f9f9] p-4 text-sm outline-none focus:border-black rounded-none transition-colors min-h-[120px]"
                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    ></textarea>
                </div>
            </form>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="w-full lg:w-[450px] flex-shrink-0">
            <div className="border-2 border-dashed border-gray-800 p-8 bg-[#fffcf5]">
                <h2 className="text-xl font-normal uppercase text-center mb-8 tracking-wide">Đơn hàng của bạn</h2>
                
                <div className="flex justify-between text-xs font-bold uppercase border-b-2 border-gray-200 pb-3 mb-4 text-gray-500">
                    <span>Sản phẩm</span>
                    <span>Tạm tính</span>
                </div>

                {/* Product List */}
                <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
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
                                            <span className="text-gray-600">{item.name}</span> 
                                            <strong className="ml-1">× {item.quantity}</strong>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            Màu sắc: {colorName} <br/>
                                            Size: {item.selectedSize}
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
                    <span className="font-bold">Tạm tính</span>
                    <span className="font-bold text-[#E71313]">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal).replace('₫', '')}₫
                    </span>
                </div>
                <div className="flex justify-between items-center text-lg mb-8 border-b-2 border-gray-200 pb-6">
                    <span className="font-bold">Tổng</span>
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
                            <label htmlFor="bank" className="font-bold text-sm cursor-pointer">Chuyển khoản ngân hàng</label>
                            {paymentMethod === 'bank' && (
                                <div className="text-xs text-gray-500 mt-2 p-3 bg-white border border-gray-200">
                                    Thông tin hướng dẫn chuyển khoản sẽ được hiện khi bạn đặt hàng thành công. Vui lòng làm theo hướng dẫn sau đó để Ecochic tiếp tục xử lý đơn hàng của bạn.
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
                        <label htmlFor="cod" className="font-bold text-sm cursor-pointer">Trả tiền mặt khi nhận hàng</label>
                    </div>
                </div>

                <button 
                    onClick={onPlaceOrder}
                    className="w-full bg-black text-white h-14 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-none"
                >
                    Đặt hàng
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
