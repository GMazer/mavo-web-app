
import React from 'react';
import { ShoppingBagIcon, ClockIcon, TruckIcon, CheckBadgeIcon } from '../ui/Icons';
import { Order } from '../../types';

interface OrderStatsProps {
    orders: Order[];
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
    const totalOrders = orders.length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const shippingCount = orders.filter(o => o.status === 'processing').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Tổng đơn hàng</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{totalOrders.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                        <ShoppingBagIcon />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Chờ xử lý</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{pendingCount}</h3>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                        <ClockIcon />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Đang giao hàng</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{shippingCount}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <TruckIcon />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Hoàn thành</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{completedCount}</h3>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <CheckBadgeIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStats;
