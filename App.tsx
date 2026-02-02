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

      {/* Breadcrumb - Changed max-w-[1600px] mx-auto to w-full */}
      <div className="w-full px-6 lg:px-10 py-6">
        <p className="text-[11px] text-gray-500 uppercase tracking-wide font-sfu-book">
            <span className="hover:text-black cursor-pointer">HOME</span> 
            <span className="mx-2 text-gray-300">/</span> 
            <span className="text-black">Quần áo</span>
        </p>
      </div>

      {/* Main Content - Changed max-w-[1600px] mx-auto to w-full */}
      <main className="w-full px-6 lg:px-10 pb-20 flex-grow">
        <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-52 flex-shrink-0 pt-1">
                <h2 className="text-2xl font-normal mb-8 font-sfu-book uppercase tracking-wide">Lọc theo</h2>
                
                <div className="py-2">
                    <button className="flex items-center justify-between w-full text-[13px] font-bold uppercase tracking-wider mb-3 font-sfu-book">
                        DANH MỤC
                        <ChevronDownIcon className="w-3 h-3" />
                    </button>
                    <div className="w-full border-t border-gray-200 mb-4"></div>
                    
                    <ul className="space-y-3 pl-1">
                        {categories.map((cat, idx) => (
                            <li key={idx}>
                                <a href="#" className="text-[13px] text-gray-600 hover:text-black transition-colors block py-0.5 font-sfu-book">
                                    {cat}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Product Grid Content */}
            <div className="flex-1">
                <div className="mb-10">
                    <h1 className="text-2xl uppercase font-normal tracking-wide font-sfu-book">QUẦN ÁO</h1>
                </div>

                {/* Grid limited to 4 columns max as requested, allowing images to scale up on large screens */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                    {PRODUCTS.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                    ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-20 flex justify-center gap-2">
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