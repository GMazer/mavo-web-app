
import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  onProductClick,
  onAddToCart 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Filter logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }
    const lowerTerm = searchTerm.toLowerCase();
    const results = products.filter(p => 
      p.name.toLowerCase().includes(lowerTerm) || 
      p.category?.toLowerCase().includes(lowerTerm) ||
      p.code?.toLowerCase().includes(lowerTerm)
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white animate-fade-in flex flex-col">
      {/* Search Header */}
      <div className="h-24 px-6 lg:px-10 border-b border-gray-100 flex items-center gap-4">
        <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Tìm kiếm sản phẩm, danh mục..." 
          className="flex-1 h-full text-2xl font-light outline-none placeholder-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XMarkIcon className="w-8 h-8 text-gray-400 hover:text-black" />
        </button>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        {searchTerm && filteredProducts.length === 0 && (
           <div className="text-center mt-20 text-gray-500">
              <p className="text-lg">Không tìm thấy kết quả nào cho "{searchTerm}"</p>
              <p className="text-sm mt-2">Vui lòng thử từ khóa khác.</p>
           </div>
        )}

        {!searchTerm && (
           <div className="mt-10 text-center text-gray-400">
              <p className="uppercase tracking-widest text-xs font-bold mb-4">Gợi ý tìm kiếm</p>
              <div className="flex flex-wrap justify-center gap-3">
                  {['Váy đầm', 'Áo khoác', 'Set bộ', 'Sơ mi'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-4 py-2 bg-gray-50 hover:bg-black hover:text-white transition-colors rounded-full text-sm"
                      >
                          {tag}
                      </button>
                  ))}
              </div>
           </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="container mx-auto">
             <p className="text-sm text-gray-500 mb-6">Tìm thấy {filteredProducts.length} kết quả</p>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                {filteredProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={(p) => {
                            onAddToCart(p);
                            // Optional: Close search or keep it open
                        }} 
                        onClick={() => {
                            onProductClick(product);
                            handleClose();
                        }}
                    />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
