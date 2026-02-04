
import React, { useState, useRef } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import ProductManager from './pages/ProductManager';
import CategoryManager from './pages/CategoryManager';
import OrderManager from './pages/OrderManager';
import Settings from './pages/Settings';

const AdminApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'settings'>('products');
    
    // Ref to hold the create function from ProductManager
    const createProductTrigger = useRef<(() => void) | null>(null);

    const getTabTitle = () => {
        switch(activeTab) {
            case 'dashboard': return 'Tổng quan';
            case 'products': return 'Sản phẩm';
            case 'categories': return 'Danh mục sản phẩm';
            case 'orders': return 'Đơn hàng';
            case 'settings': return 'Cấu hình chung';
            default: return '';
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-gray-800 capitalize">{getTabTitle()}</h2>
                    {activeTab === 'products' && (
                        <button 
                            onClick={() => createProductTrigger.current?.()}
                            className="bg-black text-white px-4 py-2 text-sm font-bold uppercase rounded hover:bg-gray-800"
                        >
                            + Thêm mới
                        </button>
                    )}
                </header>

                <div className="p-8">
                    {activeTab === 'dashboard' && <Dashboard />}
                    
                    <div style={{ display: activeTab === 'products' ? 'block' : 'none' }}>
                        <ProductManager onCreateTrigger={(fn) => createProductTrigger.current = fn} />
                    </div>

                    {activeTab === 'categories' && <CategoryManager />}

                    {activeTab === 'settings' && <Settings />}

                    {activeTab === 'orders' && <OrderManager />}
                </div>
            </main>
        </div>
    );
};

export default AdminApp;
