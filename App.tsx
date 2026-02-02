import React, { useState } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import { PRODUCTS } from './data/products';
import { Product } from './types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const categories = [
      "Váy đầm", "Áo", "Quần", "Chân váy", "Set", "Jumpsuits", "Áo khoác"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header cartCount={cart.length} />

      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-4 w-full">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-sfu-book">
            <span className="hover:text-black cursor-pointer">HOME</span> 
            <span className="mx-2">/</span> 
            <span className="text-black">Quần áo</span>
        </p>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-20 w-full flex-grow">
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                {/* Lọc theo: 21px Regular */}
                <h2 className="text-[21px] font-normal mb-6 font-sfu-book">Lọc theo</h2>
                
                <div className="py-4">
                    {/* DANH MỤC: 14px */}
                    <button className="flex items-center justify-between w-full text-[14px] uppercase tracking-wide mb-2 font-sfu-book">
                        DANH MỤC
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>
                    {/* Changed border-gray-300 to border-black */}
                    <div className="w-full border-t border-black mb-4"></div>
                    
                    <ul className="space-y-3">
                        {categories.map((cat, idx) => (
                            <li key={idx}>
                                {/* Category items: 14px */}
                                <a href="#" className="text-[14px] text-gray-600 hover:text-black hover:underline transition-colors block py-0.5 font-sfu-book">
                                    {cat}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Product Grid Content */}
            <div className="flex-1">
                <div className="mb-8">
                    {/* QUẦN ÁO: 21px Regular */}
                    <h1 className="text-[21px] uppercase font-normal tracking-wide font-sfu-book">QUẦN ÁO</h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {PRODUCTS.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                    ))}
                </div>
                
                {/* Pagination Placeholder */}
                <div className="mt-16 flex justify-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center bg-black text-white text-sm rounded-full font-sfu-book">1</span>
                    <span className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-sm rounded-full cursor-pointer font-sfu-book">2</span>
                    <span className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-sm rounded-full cursor-pointer"><ChevronRightIcon className="w-3 h-3" /></span>
                </div>
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;