
import React from 'react';
import { MagnifyingGlassIcon, BellIcon } from '../ui/Icons';

interface OrderHeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h2>
                <p className="text-sm text-gray-500 mt-1">Theo dõi và xử lý các đơn đặt hàng mới nhất.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <MagnifyingGlassIcon /> 
                    </div>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo mã, tên, SĐT..." 
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm w-72 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="p-2.5 text-gray-500 hover:text-black bg-white border border-gray-200 rounded-lg shadow-sm transition-colors">
                    <BellIcon />
                </button>
            </div>
        </div>
    );
};

export default OrderHeader;
