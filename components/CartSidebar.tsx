import React, { useEffect, useState } from 'react';
import { CartItem } from '../types';
import { XMarkIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string, size: string) => void;
  onUpdateQuantity: (id: string, size: string, newQuantity: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onUpdateQuantity,
  onCheckout
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation delay
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for transition
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold uppercase tracking-wider">Giỏ hàng ({cartItems.length})</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <p>Giỏ hàng của bạn đang trống.</p>
              <button 
                onClick={onClose}
                className="text-black font-bold border-b border-black pb-0.5 uppercase text-sm hover:text-gray-600 hover:border-gray-600 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.id}-${item.selectedSize}-${idx}`} className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-28 flex-shrink-0 bg-gray-50">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 pr-4">{item.name}</h3>
                        <button 
                            onClick={() => onRemoveItem(item.id, item.selectedSize || '')}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Phân loại: <span className="uppercase">{item.selectedSize || 'F'}</span> 
                        {item.colors && item.colors.length > 0 && ` / ${item.colors[0]}`}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                     {/* Quantity Control */}
                    <div className="flex items-center border border-gray-300 w-24 h-8 bg-white">
                        <button 
                            onClick={() => onUpdateQuantity(item.id, item.selectedSize || '', Math.max(1, item.quantity - 1))}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50"
                        >
                            <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="flex-1 text-center text-xs font-medium">{item.quantity}</span>
                        <button 
                            onClick={() => onUpdateQuantity(item.id, item.selectedSize || '', item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50"
                        >
                            <PlusIcon className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Price */}
                    <p className="text-sm font-bold">
                         {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity).replace('₫', '')}₫
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600 uppercase">Tạm tính</span>
                    <span className="text-lg font-bold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal).replace('₫', '')}₫
                    </span>
                </div>
                <p className="text-[10px] text-gray-500 mb-4 text-center">Thuế và phí vận chuyển sẽ được tính khi thanh toán.</p>
                <button 
                    onClick={onCheckout}
                    className="w-full bg-black text-white h-12 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    Thanh toán
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;