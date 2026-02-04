
import React from 'react';
import { ChartBarIcon, ShoppingBagIcon, UserGroupIcon, CogIcon } from '../ui/Icons';

interface SidebarProps {
    activeTab: 'dashboard' | 'products' | 'orders' | 'settings';
    onTabChange: (tab: 'dashboard' | 'products' | 'orders' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
    const navItemClass = (tab: string) => 
        `w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`;

    return (
        <aside className="w-64 bg-[#111827] text-white flex flex-col flex-shrink-0">
            <div className="h-16 flex items-center justify-center border-b border-gray-700">
                <h1 className="text-xl font-bold tracking-wider">MAVO CMS</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <button onClick={() => onTabChange('dashboard')} className={navItemClass('dashboard')}>
                    <ChartBarIcon /> Tổng quan
                </button>
                <button onClick={() => onTabChange('products')} className={navItemClass('products')}>
                    <ShoppingBagIcon /> Sản phẩm
                </button>
                <button onClick={() => onTabChange('orders')} className={navItemClass('orders')}>
                    <UserGroupIcon /> Đơn hàng
                </button>
                <div className="border-t border-gray-700 my-2 pt-2"></div>
                 <button onClick={() => onTabChange('settings')} className={navItemClass('settings')}>
                    <CogIcon /> Cấu hình
                </button>
            </nav>
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-500"></div>
                    <div>
                        <p className="text-sm font-medium">Quản trị viên</p>
                        <p className="text-xs text-gray-400">admin@mavo.vn</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
