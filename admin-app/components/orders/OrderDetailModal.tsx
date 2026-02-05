
import React, { useState } from 'react';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { Spinner } from '../ui/Icons';

interface OrderDetailModalProps {
    order: Order;
    onClose: () => void;
    onUpdateStatus: (id: string, status: string) => Promise<void>;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onUpdateStatus }) => {
    const [tempStatus, setTempStatus] = useState<string>(order.status);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleSaveStatus = async () => {
        setIsUpdatingStatus(true);
        try {
            await onUpdateStatus(order.id, tempStatus);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

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
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Đơn hàng #{order.id.slice(0, 8).toUpperCase()}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-gray-400 transition-colors"
                    >
                        ✕
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8">
                        <span className="text-blue-800 text-sm font-medium flex items-center gap-2">
                            Trạng thái: 
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusStyle(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>
                        </span>
                        
                        <div className="flex items-center gap-2">
                            <select 
                                className="text-xs border border-blue-300 rounded px-2 py-1.5 bg-white text-gray-700 outline-none focus:border-blue-500"
                                value={tempStatus}
                                onChange={(e) => setTempStatus(e.target.value)}
                            >
                                <option value="pending">Chờ xử lý</option>
                                <option value="processing">Đang giao</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                            <button 
                                onClick={handleSaveStatus}
                                disabled={isUpdatingStatus}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                            >
                                {isUpdatingStatus && <Spinner />}
                                {isUpdatingStatus ? 'Lưu...' : 'Cập nhật'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                        <div>
                            <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-4">Khách hàng</h4>
                            <div className="flex items-start gap-4">
                                <div>
                                    <p className="font-bold text-gray-900 text-lg">{order.customerName}</p>
                                    <p className="text-sm text-gray-500 mt-1">{order.customerEmail}</p>
                                    <p className="text-sm font-medium text-gray-700 mt-1">{order.customerPhone}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-4">Địa chỉ giao hàng</h4>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 leading-relaxed">
                                <p>{order.addressDetail}</p>
                                <p>{order.ward}, {order.district}</p>
                                <p className="font-bold mt-1">{order.city}</p>
                            </div>
                        </div>
                    </div>

                    <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-4">Chi tiết sản phẩm</h4>
                    <div className="border rounded-lg overflow-hidden border-gray-200">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Sản phẩm</th>
                                    <th className="px-4 py-3 text-right">Đơn giá</th>
                                    <th className="px-4 py-3 text-right">SL</th>
                                    <th className="px-4 py-3 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.size} / {item.color}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">{formatCurrency(item.price)}</td>
                                        <td className="px-4 py-3 text-right text-sm">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right text-sm font-bold">{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan={3} className="px-4 py-3 text-right text-sm font-bold text-gray-600">Tổng cộng</td>
                                    <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {order.note && (
                        <div className="mt-6">
                            <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-2">Ghi chú từ khách hàng</h4>
                            <p className="text-sm text-gray-600 italic bg-yellow-50 p-3 border border-yellow-100 rounded">"{order.note}"</p>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">In hóa đơn</button>
                        <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 shadow-lg shadow-gray-300"
                        >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
