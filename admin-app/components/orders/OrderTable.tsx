
import React from 'react';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { Spinner, ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons';

interface OrderTableProps {
    orders: Order[];
    totalOrders: number;
    loading: boolean;
    selectedOrderIds: Set<string>;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectRow: (id: string) => void;
    onOpenDetail: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
    orders,
    totalOrders,
    loading,
    selectedOrderIds,
    onSelectAll,
    onSelectRow,
    onOpenDetail
}) => {
    
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-700 border border-blue-200';
            case 'completed': return 'bg-green-100 text-green-700 border border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'processing': return 'Đang giao';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : (
                <div className="overflow-x-auto pb-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 tracking-wider">
                                <th className="px-6 py-4 font-semibold w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-black focus:ring-black cursor-pointer" 
                                        onChange={onSelectAll}
                                        checked={orders.length > 0 && selectedOrderIds.size === orders.length}
                                    />
                                </th>
                                <th className="px-6 py-4 font-semibold">Mã đơn / Khách hàng</th>
                                <th className="px-6 py-4 font-semibold">Ngày đặt</th>
                                <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                                <th className="px-6 py-4 font-semibold text-right">Tổng tiền</th>
                                <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                                <th className="px-6 py-4 font-semibold text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => {
                                const firstItem = order.items[0]; 
                                const productImage = 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=100&auto=format&fit=crop'; 
                                const isSelected = selectedOrderIds.has(order.id);

                                return (
                                    <tr 
                                        key={order.id} 
                                        className={`transition-colors group cursor-pointer ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`} 
                                        onClick={() => onOpenDetail(order)}
                                    >
                                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                                checked={isSelected}
                                                onChange={() => onSelectRow(order.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-bold text-black text-sm group-hover:underline">
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </div>
                                                <div className="text-sm font-medium text-gray-700 mt-1">{order.customerName}</div>
                                                <div className="text-xs text-gray-400">{order.customerPhone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {firstItem ? (
                                                <div className="flex items-center gap-3">
                                                    <img src={productImage} alt="Product" className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                                                    <div>
                                                        <p className="text-sm text-gray-900 font-medium line-clamp-1 max-w-[150px]">{firstItem.name}</p>
                                                        {order.items.length > 1 && (
                                                            <p className="text-xs text-gray-500">+ {order.items.length - 1} sản phẩm khác</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">Không có thông tin SP</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-gray-900">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                className="text-gray-400 hover:text-black font-medium text-sm transition-colors border border-gray-200 px-3 py-1 rounded hover:border-black"
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-500">
                                        Không tìm thấy đơn hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination (Static) */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    Hiển thị <span className="font-medium text-gray-900">1-{orders.length}</span> trong số <span className="font-medium text-gray-900">{totalOrders}</span> đơn hàng
                </p>
                <div className="flex items-center gap-2">
                     <button className="p-2 border border-gray-300 rounded hover:bg-white text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        <ChevronLeftIcon />
                     </button>
                     <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded text-sm font-bold shadow-sm">1</button>
                     <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 rounded text-sm text-gray-600">2</button>
                     <button className="p-2 border border-gray-300 rounded hover:bg-white text-gray-600 hover:text-black">
                        <ChevronRightIcon />
                     </button>
                </div>
            </div>
        </div>
    );
};

export default OrderTable;
