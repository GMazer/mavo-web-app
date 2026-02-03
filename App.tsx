import React, { useState } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import { PRODUCTS } from './data/products';
import { Product, CartItem } from './types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

type ViewState = 'home' | 'product' | 'checkout';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Improved addToCart to handle grouping
  const addToCart = (product: Product, quantity = 1, size = 'M') => {
    setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(
            item => item.id === product.id && item.selectedSize === size
        );

        if (existingItemIndex > -1) {
            const newCart = [...prevCart];
            newCart[existingItemIndex].quantity += quantity;
            return newCart;
        } else {
            return [...prevCart, { ...product, quantity, selectedSize: size }];
        }
    });
    // Open sidebar automatically when adding, ONLY if not going straight to checkout
    if (currentView !== 'checkout') {
        setIsCartOpen(true);
    }
  };

  const handleBuyNow = (product: Product, quantity: number, size: string) => {
    addToCart(product, quantity, size);
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id: string, size: string, newQuantity: number) => {
      if (newQuantity < 1) return;
      setCart(prev => prev.map(item => 
          (item.id === id && item.selectedSize === size) 
            ? { ...item, quantity: newQuantity } 
            : item
      ));
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo(0,0);
  };

  const goHome = () => {
    setSelectedProduct(null);
    setCurrentView('home');
    window.scrollTo(0,0);
  };

  const handlePlaceOrder = () => {
    alert("Cảm ơn bạn đã đặt hàng! Đơn hàng đang được xử lý.");
    setCart([]);
    goHome();
  };

  // Calculate total count for header badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
      "Váy đầm", "Áo", "Quần", "Chân váy", "Set", "Jumpsuits", "Áo khoác"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header 
        cartCount={totalItems} 
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleGoToCheckout}
      />

      {/* Breadcrumb */}
      <div className="w-full px-6 lg:px-10 py-6 border-b border-gray-100 lg:border-none">
        <p className="text-sm text-gray-500 uppercase tracking-wide">
            <span className="hover:text-black cursor-pointer" onClick={goHome}>HOME</span> 
            
            {currentView === 'checkout' ? (
                 <>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-black">Thanh toán</span>
                 </>
            ) : currentView === 'product' && selectedProduct ? (
                <>
                    <span className="mx-2 text-gray-300">/</span> 
                    <span className="hover:text-black cursor-pointer text-gray-500" onClick={goHome}>Quần áo</span>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-400">{selectedProduct.category}</span>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-black">{selectedProduct.name}</span>
                </>
            ) : (
                <>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-black">Quần áo</span>
                </>
            )}
        </p>
      </div>

      {/* Main Content Router */}
      <main className="w-full flex-grow">
        {currentView === 'checkout' ? (
             <Checkout 
                cartItems={cart} 
                onPlaceOrder={handlePlaceOrder}
             />
        ) : currentView === 'product' && selectedProduct ? (
             <div className="px-6 lg:px-10 pb-20">
                <ProductDetail 
                    product={selectedProduct} 
                    onAddToCart={addToCart}
                    onBuyNow={handleBuyNow}
                    onRelatedClick={handleProductClick}
                />
             </div>
        ) : (
             <div className="px-6 lg:px-10 pb-20">
                 <div className="flex flex-col lg:flex-row gap-4">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-[300px] flex-shrink-0 pt-1">
                        <h2 className="text-[26px] font-normal mb-8 uppercase tracking-wide">Lọc theo</h2>
                        
                        <div className="py-2">
                            <button className="flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-3">
                                DANH MỤC
                                <ChevronDownIcon className="w-3 h-3" />
                            </button>
                            <div className="w-full border-t border-gray-200 mb-4"></div>
                            
                            <ul className="space-y-3 pl-1">
                                {categories.map((cat, idx) => (
                                    <li key={idx}>
                                        <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors block py-0.5">
                                            {cat}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid Content */}
                    <div className="flex-1">
                        <div className="mb-3">
                            <h1 className="text-[26px] uppercase font-normal tracking-wide">QUẦN ÁO</h1>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                            {PRODUCTS.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    // Default add to cart behavior from card is 1 item, Size M (or handled inside)
                                    onAddToCart={(p) => addToCart(p, 1, 'M')} 
                                    onClick={() => handleProductClick(product)}
                                />
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        <div className="mt-20 flex justify-center gap-2">
                            <span className="w-8 h-8 flex items-center justify-center bg-black text-white text-sm rounded-full">1</span>
                            <span className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-sm rounded-full cursor-pointer">2</span>
                            <span className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-sm rounded-full cursor-pointer"><ChevronRightIcon className="w-3 h-3" /></span>
                        </div>
                    </div>
                </div>
             </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;