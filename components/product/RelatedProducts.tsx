
import React from 'react';
import { Product } from '../../types';
import ProductCard from '../ProductCard';

interface RelatedProductsProps {
    products: Product[];
    onRelatedClick: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, onRelatedClick, onAddToCart }) => {
    return (
        <div className="mt-20">
            <h3 className="text-base font-normal uppercase mb-6 tracking-wide">CÓ THỂ BẠN SẼ THÍCH</h3>
            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
                    {products.map(rp => (
                        <ProductCard 
                            key={rp.id} 
                            product={rp} 
                            onAddToCart={(p) => onAddToCart(p)} 
                            onClick={() => onRelatedClick(rp)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400">Không có sản phẩm liên quan.</p>
            )}
        </div>
    );
};

export default RelatedProducts;
