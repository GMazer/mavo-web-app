
import React, { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import { Product, Category } from '../types';
import { fetchProductsApi, saveProductApi, deleteProductApi, fetchCategoriesApi } from '../services/api';
import { 
    MagnifyingGlassIcon, Spinner, FunnelIcon, ArrowDownTrayIcon, PlusIcon, 
    ShoppingBagIcon, TagIcon 
} from '../components/ui/Icons';

// Custom icons for stats cards
const AlertIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const OutStockIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

const ProductManager: React.FC<{ onCreateTrigger: (trigger: () => void) => void }> = ({ onCreateTrigger }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStock, setFilterStock] = useState('All');

    // Initial Fetch
    useEffect(() => {
        loadData();
    }, []);

    // Bind Create Trigger to Parent
    useEffect(() => {
        onCreateTrigger(() => handleCreateNew);
    }, [onCreateTrigger]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([
                fetchProductsApi(),
                fetchCategoriesApi()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error(error);
            alert("Lỗi tải dữ liệu");
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
            isVisible: true,
            stock: 100
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
        const newStatus = !(product.isVisible !== false);
        const updatedProduct = { ...product, isVisible: newStatus };
        setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));

        try {
            await saveProductApi(updatedProduct);
        } catch (error: any) {
            setProducts(prev => prev.map(p => p.id === product.id ? product : p));
            alert(`Không thể cập nhật: ${error.message}`);
        }
    };

    const handleDelete = async (product: Product) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa "${product.name}"?`)) {
            try {
                setProducts(prev => prev.filter(p => p.id !== product.id));
                await deleteProductApi(product.id);
            } catch (error: any) {
                alert(`Lỗi khi xóa: ${error.message}`);
                loadData();
            }
        }
    };

    // --- Stats Calculations ---
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length;
    const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length;
    const activeCategoriesCount = categories.length; // Assuming all fetched are active

    // --- Filter Logic ---
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;

        let matchesStock = true;
        const stock = p.stock || 0;
        if (filterStock === 'Low') matchesStock = stock > 0 && stock < 10;
        if (filterStock === 'Out') matchesStock = stock === 0;
        if (filterStock === 'In') matchesStock = stock >= 10;

        return matchesSearch && matchesCategory && matchesStock;
    });

    return (
        <div className="space-y-6 font-sans">
             {/* STATS CARDS */}
             {!editingProduct && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng sản phẩm</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{totalProducts.toLocaleString()}</h3>
                            <span className="text-green-500 text-xs font-bold mt-1 inline-block">↗ +12% mẫu mới</span>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBagIcon /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Sắp hết hàng</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{lowStockCount}</h3>
                            <span className="text-orange-500 text-xs font-bold mt-1 inline-block">Cần nhập thêm</span>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AlertIcon /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Hết hàng</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{outOfStockCount}</h3>
                            <span className="text-red-500 text-xs font-bold mt-1 inline-block">Mất doanh thu</span>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg"><OutStockIcon /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Danh mục hoạt động</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{activeCategoriesCount}</h3>
                            <span className="text-gray-400 text-xs mt-1 inline-block">Trên 3 ngành hàng</span>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><TagIcon /></div>
                    </div>
                 </div>
             )}

            {/* MAIN CONTENT */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] overflow-hidden">
                {editingProduct ? (
                    <ProductForm 
                        initialProduct={editingProduct} 
                        onCancel={() => setEditingProduct(null)}
                        onSaved={handleSaved}
                    />
                ) : (
                    <>
                        {/* FILTER BAR */}
                        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                                {/* Category Filter */}
                                <div className="relative">
                                    <select 
                                        value={filterCategory}
                                        onChange={e => setFilterCategory(e.target.value)}
                                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 pr-8"
                                    >
                                        <option value="All">Danh mục: Tất cả</option>
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500"><FunnelIcon /></div>
                                </div>

                                {/* Stock Filter */}
                                <div className="relative">
                                    <select 
                                        value={filterStock}
                                        onChange={e => setFilterStock(e.target.value)}
                                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 pr-8"
                                    >
                                        <option value="All">Kho: Tất cả</option>
                                        <option value="In">Còn hàng</option>
                                        <option value="Low">Sắp hết</option>
                                        <option value="Out">Hết hàng</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500"><FunnelIcon /></div>
                                </div>

                                {/* Reset */}
                                {(filterCategory !== 'All' || filterStock !== 'All') && (
                                    <button 
                                        onClick={() => { setFilterCategory('All'); setFilterStock('All'); }}
                                        className="text-sm text-red-500 hover:underline font-medium"
                                    >
                                        Đặt lại
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                 {/* Search */}
                                 <div className="relative flex-1 md:w-64">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                        <MagnifyingGlassIcon />
                                    </div>
                                    <input 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full pl-10 p-2.5 outline-none" 
                                        placeholder="Tìm sản phẩm, SKU..." 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <button className="flex items-center gap-2 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2.5 text-center shadow-sm">
                                    <ArrowDownTrayIcon />
                                    <span className="hidden md:inline">Xuất CSV</span>
                                </button>
                                <button 
                                    onClick={handleCreateNew}
                                    className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-lg text-sm px-4 py-2.5 text-center shadow-md shadow-blue-200"
                                >
                                    <PlusIcon />
                                    <span className="hidden md:inline">Thêm sản phẩm</span>
                                </button>
                            </div>
                        </div>

                        {/* PRODUCT LIST */}
                        <ProductList 
                            products={filteredProducts} 
                            loading={loading} 
                            onEdit={setEditingProduct} 
                            onToggleVisibility={handleToggleVisibility}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductManager;
