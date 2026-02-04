
import React, { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import { Product } from '../types';
import { fetchProductsApi, saveProductApi } from '../services/api';

const ProductManager: React.FC<{ onCreateTrigger: (trigger: () => void) => void }> = ({ onCreateTrigger }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Initial Fetch
    useEffect(() => {
        loadProducts();
    }, []);

    // Bind Create Trigger to Parent
    useEffect(() => {
        onCreateTrigger(() => handleCreateNew);
    }, [onCreateTrigger]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchProductsApi();
            setProducts(data);
        } catch (error) {
            console.error(error);
            alert("Lỗi tải sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingProduct({
            id: '', 
            name: '',
            description: '',
            price: 0,
            originalPrice: 0,
            sku: '',
            images: [],
            colors: [],
            category: 'Quần áo',
            isVisible: true // Default visible
        });
    };

    const handleSaved = (savedProduct: Product, isNew: boolean) => {
        if (isNew) {
            setProducts(prev => [savedProduct, ...prev]);
        } else {
            setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
        }
        setEditingProduct(null);
    };

    const handleToggleVisibility = async (product: Product) => {
        // Optimistic Update: Switch UI immediately
        const newStatus = !(product.isVisible !== false);
        const updatedProduct = { ...product, isVisible: newStatus };
        
        setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));

        try {
            // Call API silently
            await saveProductApi(updatedProduct);
        } catch (error: any) {
            console.error("Failed to toggle visibility", error);
            // Revert if failed
            setProducts(prev => prev.map(p => p.id === product.id ? product : p));
            alert(`Không thể cập nhật trạng thái: ${error.message}`);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 min-h-[400px]">
            {editingProduct ? (
                <ProductForm 
                    initialProduct={editingProduct} 
                    onCancel={() => setEditingProduct(null)}
                    onSaved={handleSaved}
                />
            ) : (
                <ProductList 
                    products={products} 
                    loading={loading} 
                    onEdit={setEditingProduct} 
                    onToggleVisibility={handleToggleVisibility}
                />
            )}
        </div>
    );
};

export default ProductManager;
