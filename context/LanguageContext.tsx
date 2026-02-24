import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface Translations {
  [key: string]: {
    vi: string;
    en: string;
  };
}

export const translations: Translations = {
  // Header
  'nav.clothing': { vi: 'QUẦN ÁO', en: 'CLOTHING' },
  'nav.footwear': { vi: 'GIÀY DÉP', en: 'FOOTWEAR' },
  'nav.accessories': { vi: 'TÚI VÀ PHỤ KIỆN', en: 'BAGS & ACCESSORIES' },
  'nav.sale': { vi: 'SALE OFF', en: 'SALE OFF' },
  'nav.collections': { vi: 'BỘ SƯU TẬP', en: 'COLLECTIONS' },
  'nav.fashionshow': { vi: 'TRÌNH DIỄN THỜI TRANG', en: 'FASHION SHOW' },
  
  // App / Sidebar
  'filter.title': { vi: 'Lọc theo', en: 'Filter by' },
  'filter.category': { vi: 'DANH MỤC', en: 'CATEGORIES' },
  'filter.all': { vi: 'Tất cả sản phẩm', en: 'All products' },
  'app.clothing': { vi: 'QUẦN ÁO', en: 'CLOTHING' },
  'app.noproducts': { vi: 'Chưa có sản phẩm nào trong danh mục này.', en: 'No products in this category.' },
  'app.viewall': { vi: 'Xem tất cả sản phẩm', en: 'View all products' },
  'app.loading': { vi: 'Đang tải dữ liệu từ máy chủ...', en: 'Loading data from server...' },
  'app.home': { vi: 'HOME', en: 'HOME' },
  'app.checkout': { vi: 'Thanh toán', en: 'Checkout' },
  
  // Product Card
  'product.buynow': { vi: 'Mua ngay', en: 'Buy now' },
  
  // Product Detail
  'detail.code': { vi: 'Mã sản phẩm:', en: 'Product code:' },
  'detail.reviews': { vi: 'Đánh giá', en: 'Reviews' },
  'detail.size': { vi: 'Kích thước', en: 'Size' },
  'detail.sizeguide': { vi: 'Hướng dẫn chọn size', en: 'Size guide' },
  'detail.color': { vi: 'Chọn màu sắc', en: 'Select color' },
  'detail.quantity': { vi: 'Số lượng', en: 'Quantity' },
  'detail.addtocart': { vi: 'THÊM VÀO GIỎ', en: 'ADD TO CART' },
  'detail.buynow': { vi: 'MUA NGAY', en: 'BUY NOW' },
  'detail.freeshipping': { vi: 'Miễn phí giao hàng toàn quốc cho đơn từ 1.000.000đ', en: 'Free nationwide shipping for orders over 1,000,000 VND' },
  'detail.exchange': { vi: '6 ngày đổi hàng khi mua tại Showroom, 15 ngày khi mua Online', en: '6 days exchange at Showroom, 15 days Online' },
  'detail.hotline': { vi: 'Hotline', en: 'Hotline' },
  'detail.hotline_desc': { vi: 'hỗ trợ hành chính từ 8h30 - 17h mỗi ngày (T2-CN)', en: 'support from 8:30 AM - 5:00 PM daily (Mon-Sun)' },
  'detail.delivery': { vi: 'Giao hàng tận nơi, hoàn tiền thứ 5 hàng tuần', en: 'Delivery to your door, refunds every Thursday' },
  'detail.highlights': { vi: 'ĐẶC ĐIỂM NỔI BẬT', en: 'HIGHLIGHTS' },
  'detail.youmaylike': { vi: 'CÓ THỂ BẠN SẼ THÍCH', en: 'YOU MAY ALSO LIKE' },
  'detail.select_size_error': { vi: 'Vui lòng chọn kích thước!', en: 'Please select a size!' },
  
  // Cart Sidebar
  'cart.title': { vi: 'GIỎ HÀNG', en: 'CART' },
  'cart.empty': { vi: 'Chưa có sản phẩm nào trong giỏ hàng.', en: 'No products in cart.' },
  'cart.total': { vi: 'TỔNG TIỀN', en: 'TOTAL' },
  'cart.checkout': { vi: 'THANH TOÁN', en: 'CHECKOUT' },
  'cart.added': { vi: 'Đã thêm', en: 'Added' },
  'cart.intocart': { vi: 'vào giỏ hàng!', en: 'to cart!' },
  'cart.removed': { vi: 'Đã xóa sản phẩm khỏi giỏ hàng.', en: 'Removed product from cart.' },
  
  // Checkout
  'checkout.title': { vi: 'Thanh toán', en: 'Checkout' },
  'checkout.shipping_info': { vi: 'Thông tin giao hàng', en: 'Shipping Information' },
  'checkout.fullname': { vi: 'Họ và tên', en: 'Full name' },
  'checkout.phone': { vi: 'Số điện thoại', en: 'Phone number' },
  'checkout.address': { vi: 'Địa chỉ giao hàng', en: 'Shipping address' },
  'checkout.notes': { vi: 'Ghi chú đơn hàng (Tùy chọn)', en: 'Order notes (Optional)' },
  'checkout.payment_method': { vi: 'Phương thức thanh toán', en: 'Payment method' },
  'checkout.cod': { vi: 'Thanh toán khi nhận hàng (COD)', en: 'Cash on delivery (COD)' },
  'checkout.bank': { vi: 'Chuyển khoản ngân hàng', en: 'Bank transfer' },
  'checkout.your_order': { vi: 'Đơn hàng của bạn', en: 'Your order' },
  'checkout.subtotal': { vi: 'Tạm tính', en: 'Subtotal' },
  'checkout.shipping_fee': { vi: 'Phí vận chuyển', en: 'Shipping fee' },
  'checkout.free': { vi: 'Miễn phí', en: 'Free' },
  'checkout.total': { vi: 'Tổng cộng', en: 'Total' },
  'checkout.place_order': { vi: 'ĐẶT HÀNG', en: 'PLACE ORDER' },
  'checkout.back_to_cart': { vi: 'Quay lại giỏ hàng', en: 'Back to cart' },
  'checkout.success': { vi: 'Đặt hàng thành công! Mavo sẽ liên hệ sớm nhất.', en: 'Order placed successfully! Mavo will contact you soon.' },
  
  // Search Overlay
  'search.placeholder': { vi: 'Tìm kiếm sản phẩm...', en: 'Search products...' },
  'search.notfound': { vi: 'Không tìm thấy sản phẩm nào.', en: 'No products found.' },
  'search.suggestions': { vi: 'Gợi ý cho bạn', en: 'Suggestions for you' },
  
  // Footer
  'footer.about': { vi: 'VỀ CHÚNG TÔI', en: 'ABOUT US' },
  'footer.support': { vi: 'HỖ TRỢ KHÁCH HÀNG', en: 'CUSTOMER SUPPORT' },
  'footer.newsletter': { vi: 'ĐĂNG KÝ NHẬN TIN', en: 'NEWSLETTER' },
  'footer.email_placeholder': { vi: 'Nhập email của bạn', en: 'Enter your email' },
  'footer.subscribe': { vi: 'Đăng ký', en: 'Subscribe' },
  'footer.follow': { vi: 'Theo dõi chúng tôi', en: 'Follow us' },
  'footer.rights': { vi: 'Bản quyền thuộc về MAVO FASHION.', en: 'All rights reserved by MAVO FASHION.' },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');

  useEffect(() => {
    // Detect browser language on initial load
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) {
      setLanguage('en');
    } else {
      setLanguage('vi');
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    console.warn(`Translation key not found: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
