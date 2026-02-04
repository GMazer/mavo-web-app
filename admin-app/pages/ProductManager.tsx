
import React, { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import { Product } from '../types';
import { fetchProductsApi, saveProductApi, deleteProductApi } from '../services/api';
import { MagnifyingGlassIcon, Spinner } from '../components/ui/Icons';

const ProductManager: React.FC<{ onCreateTrigger: (trigger: () => void) => void }> = ({ onCreateTrigger }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    
    // Search State
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleDelete = async (product: Product) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
            try {
                // Optimistic Update: Remove from list immediately
                setProducts(prev => prev.filter(p => p.id !== product.id));
                
                // Call API
                await deleteProductApi(product.id);
            } catch (error: any) {
                console.error("Failed to delete", error);
                alert(`Lỗi khi xóa: ${error.message}`);
                // Re-fetch if fail to ensure state sync
                loadProducts();
            }
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-4">
             {/* Search Bar - Only show when not editing */}
            {!editingProduct && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow-sm border border-gray-200 max-w-md">
                    <MagnifyingGlassIcon />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên hoặc SKU..." 
                        className="flex-1 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {loading && <Spinner />}
                </div>
            )}

            <div className="bg-white rounded-lg shadow border border-gray-200 min-h-[400px]">
                {editingProduct ? (
                    <ProductForm 
                        initialProduct={editingProduct} 
                        onCancel={() => setEditingProduct(null)}
                        onSaved={handleSaved}
                    />
                ) : (
                    <ProductList 
                        products={filteredProducts} 
                        loading={loading} 
                        onEdit={setEditingProduct} 
                        onToggleVisibility={handleToggleVisibility}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductManager;
