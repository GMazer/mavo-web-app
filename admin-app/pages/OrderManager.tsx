
import React, { useEffect, useState } from 'react';
import { fetchOrdersApi } from '../services/api';
import { Spinner } from '../components/ui/Icons';
import { formatCurrency } from '../utils/helpers';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
}

interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    addressDetail: string;
    city: string;
    district: string;
    ward: string;
    note: string;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchOrdersApi();
            setOrders(data);
        } catch (error) {
            alert("Lỗi tải đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Chờ xử lý</span>;
            case 'processing': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Đang xử lý</span>;
            case 'completed': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Hoàn thành</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Đã hủy</span>;
            default: return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold mb-4">Danh sách đơn hàng</h3>

            {loading ? (
                <div className="flex justify-center p-10"><Spinner /></div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Mã ĐH</th>
                                <th className="px-6 py-4">Khách hàng</th>
                                <th className="px-6 py-4">Tổng tiền</th>
                                <th className="px-6 py-4">Thanh toán</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Ngày tạo</th>
                                <th className="px-6 py-4">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-xs font-mono">{order.id.slice(0, 8)}...</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">{formatCurrency(order.totalAmount)}</td>
                                    <td className="px-6 py-4 text-sm">{order.paymentMethod}</td>
                                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-10 text-gray-500">Chưa có đơn hàng nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder.id.slice(0, 8)}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-black">✕</button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-bold text-sm uppercase text-gray-500 mb-2">Thông tin khách hàng</h4>
                                    <p><strong>Tên:</strong> {selectedOrder.customerName}</p>
                                    <p><strong>SĐT:</strong> {selectedOrder.customerPhone}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customerEmail || 'Không có'}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase text-gray-500 mb-2">Địa chỉ giao hàng</h4>
                                    <p>{selectedOrder.addressDetail}</p>
                                    <p>{selectedOrder.ward}, {selectedOrder.district}</p>
                                    <p>{selectedOrder.city}</p>
                                </div>
                            </div>
                            
                            {selectedOrder.note && (
                                <div className="mb-6 bg-yellow-50 p-3 rounded text-sm">
                                    <strong>Ghi chú:</strong> {selectedOrder.note}
                                </div>
                            )}

                            <h4 className="font-bold text-sm uppercase text-gray-500 mb-2">Sản phẩm</h4>
                            <table className="w-full text-left border-collapse mb-6">
                                <thead>
                                    <tr className="border-b text-sm">
                                        <th className="py-2">Tên SP</th>
                                        <th className="py-2">Phân loại</th>
                                        <th className="py-2 text-right">SL</th>
                                        <th className="py-2 text-right">Đơn giá</th>
                                        <th className="py-2 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx} className="border-b last:border-0">
                                            <td className="py-2 text-sm">{item.name}</td>
                                            <td className="py-2 text-sm text-gray-500">{item.size} / {item.color}</td>
                                            <td className="py-2 text-right">{item.quantity}</td>
                                            <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                                            <td className="py-2 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={4} className="py-4 text-right font-bold uppercase">Tổng cộng</td>
                                        <td className="py-4 text-right font-bold text-lg">{formatCurrency(selectedOrder.totalAmount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;
