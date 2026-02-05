
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import { Product, CartItem, AppSettings, Category } from './types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

type ViewState = 'home' | 'product' | 'checkout';

// Auto-detect API URL: Use localhost for development, production URL for deployment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? 'http://localhost:8080/api' : 'https://mavo-fashion-api.mavo-web.workers.dev/api';

const API_PRODUCTS = `${API_BASE}/products`;
const API_SETTINGS = `${API_BASE}/settings`;
const API_CATEGORIES = `${API_BASE}/categories`;

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [appSettings, setAppSettings] = useState<AppSettings>({
      hotline: '1800 6525',
      email: 'CSKH@MAVOFASHION.COM',
      zalo: '',
      sizeGuideDefault: '',
      careGuideDefault: '',
      returnPolicyDefault: ''
  });

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // FETCH DATA FROM SERVER
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Parallel Fetch: Products + Settings + Categories
        const [prodRes, settRes, catRes] = await Promise.all([
            fetch(`${API_PRODUCTS}?_t=${Date.now()}`),
            fetch(`${API_SETTINGS}?_t=${Date.now()}`),
            fetch(`${API_CATEGORIES}?_t=${Date.now()}`)
        ]);

        if (prodRes.ok) {
            const data = await prodRes.json();
            const items = Array.isArray(data) ? data : (data.items || []);
            
            const normalizedData = items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.pricing?.price ?? item.price ?? 0,
                originalPrice: item.pricing?.compareAtPrice ?? item.originalPrice,
                image: item.thumbnailUrl || (item.images && item.images[0]) || item.image || '', 
                images: item.images || [], 
                category: item.category,
                code: item.sku,
                colors: item.colors,
                description: item.description,
                highlights: item.highlights,
                material: item.material,
                gender: item.gender,
                customSizeGuide: item.customSizeGuide
            }));
            setProducts(normalizedData);
        }

        if (settRes.ok) {
            const settingsData = await settRes.json();
            setAppSettings(prev => ({ ...prev, ...settingsData }));
        }

        if (catRes.ok) {
            const catData = await catRes.json();
            setCategories(catData);
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Fallback categories if fetch fails, but preferred from DB
  const displayCategories = categories.length > 0 ? categories.map(c => c.name) : ["Váy đầm", "Áo", "Quần", "Chân váy", "Set", "Jumpsuits", "Áo khoác"];

  // Loading Screen
  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                  <p className="text-gray-500 text-sm tracking-wider uppercase">Đang tải dữ liệu...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header 
        cartCount={totalItems} 
        onOpenCart={() => setIsCartOpen(true)}
        onLogoClick={goHome}
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
                    allProducts={products}
                    settings={appSettings} // Pass settings
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
                                {displayCategories.map((cat, idx) => (
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

                        {products.length === 0 ? (
                            <div className="py-20 text-center text-gray-500">
                                Không tìm thấy sản phẩm nào.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                                {products.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onAddToCart={(p) => addToCart(p, 1, 'M')} 
                                        onClick={() => handleProductClick(product)}
                                    />
                                ))}
                            </div>
                        )}
                        
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

      <Footer settings={appSettings} />
    </div>
  );
};

export default App;
