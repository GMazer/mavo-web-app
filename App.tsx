import React, { useState } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import { PRODUCTS } from './data/products';
import { Product } from './types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  // Simple view state management (Navigation)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addToCart = (product: Product, quantity = 1, size = 'M') => {
    // In a real app, handle size/quantity aggregation here
    const itemsToAdd = Array(quantity).fill(product);
    setCart([...cart, ...itemsToAdd]);
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const goHome = () => {
    setSelectedProduct(null);
  };

  const categories = [
      "Váy đầm", "Áo", "Quần", "Chân váy", "Set", "Jumpsuits", "Áo khoác"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header cartCount={cart.length} />

      {/* Breadcrumb */}
      <div className="w-full px-6 lg:px-10 py-6 border-b border-gray-100 lg:border-none">
        <p className="text-sm text-gray-500 uppercase tracking-wide">
            <span className="hover:text-black cursor-pointer" onClick={goHome}>HOME</span> 
            <span className="mx-2 text-gray-300">/</span> 
            <span className={`hover:text-black cursor-pointer ${!selectedProduct ? 'text-black' : ''}`} onClick={goHome}>
                Quần áo
            </span>
            {selectedProduct && (
                <>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-400">{selectedProduct.category}</span>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-black">{selectedProduct.name}</span>
                </>
            )}
        </p>
      </div>

      {/* Main Content */}
      <main className="w-full px-6 lg:px-10 pb-20 flex-grow">
        
        {selectedProduct ? (
            // PRODUCT DETAIL VIEW
            <ProductDetail 
                product={selectedProduct} 
                onAddToCart={addToCart}
                onRelatedClick={handleProductClick}
            />
        ) : (
            // HOME / LIST VIEW
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
                                onAddToCart={(p) => addToCart(p)} 
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;