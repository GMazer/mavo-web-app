
import React, { useEffect, useState } from 'react';
import { fetchOrdersApi } from '../services/api';
import { 
    Spinner, MagnifyingGlassIcon, CalendarIcon, FunnelIcon, 
    ArrowDownTrayIcon, PlusIcon, ShoppingBagIcon, ClockIcon, 
    TruckIcon, CheckBadgeIcon, ChevronLeftIcon, ChevronRightIcon, BellIcon 
} from '../components/ui/Icons';
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

// MAVO Logo SVG Component
const MavoLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
        <rect width="100" height="100" fill="black"/>
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="70" fill="white">M</text>
    </svg>
);

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchOrdersApi();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Statistics Calculations ---
    const totalOrders = orders.length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const shippingCount = orders.filter(o => o.status === 'processing').length; // Assuming processing = shipping for demo
    const completedCount = orders.filter(o => o.status === 'completed').length;

    // --- Filter Logic ---
    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
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
        <div className="space-y-8 animate-fade-in font-sans pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h2>
                    <p className="text-sm text-gray-500 mt-1">Theo dõi và xử lý các đơn đặt hàng mới nhất.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <MagnifyingGlassIcon />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm đơn hàng..." 
                            className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                         <div className="absolute left-2 top-2.5 text-gray-400 pointer-events-none">
                            <MagnifyingGlassIcon /> 
                         </div>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-black bg-white border border-gray-200 rounded-lg shadow-sm">
                        <BellIcon />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Orders */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng đơn hàng</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{totalOrders.toLocaleString()}</h3>
                            <p className="text-green-500 text-xs font-bold mt-2 flex items-center">
                                <span className="bg-green-100 px-1.5 py-0.5 rounded mr-1">↑ 5%</span> 
                                tuần này
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <MavoLogo />
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Chờ xử lý</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{pendingCount}</h3>
                            <p className="text-orange-500 text-xs mt-2">Cần hành động ngay</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                            <ClockIcon />
                        </div>
                    </div>
                </div>

                {/* Shipping */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Đang giao hàng</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{shippingCount}</h3>
                            <p className="text-gray-400 text-xs mt-2">Đang vận chuyển</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <TruckIcon />
                        </div>
                    </div>
                </div>

                 {/* Completed */}
                 <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Hoàn thành</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{completedCount}</h3>
                            <p className="text-gray-400 text-xs mt-2">Tổng đơn giao thành công</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <CheckBadgeIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">
                        <CalendarIcon />
                        <span>30 ngày qua</span>
                    </button>
                    
                    <div className="relative">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 pr-8 cursor-pointer focus:outline-none"
                        >
                            <option value="All">Trạng thái: Tất cả</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang giao</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                        <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                            <FunnelIcon />
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setFilterStatus('All')} 
                        className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                    >
                        Đặt lại bộ lọc
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 w-full md:w-auto justify-center">
                        <ArrowDownTrayIcon />
                        <span>Xuất CSV</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 w-full md:w-auto justify-center shadow-md shadow-blue-200">
                        <PlusIcon />
                        <span>Tạo đơn</span>
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 tracking-wider">
                                    <th className="px-6 py-4 font-semibold w-10">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
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
                                {filteredOrders.map((order) => {
                                    // Generate initials for avatar
                                    const initials = order.customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                    const firstItem = order.items[0]; // Display representative item
                                    
                                    // Normally we would have product image in order item, assuming mock placeholder if missing
                                    const productImage = 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=100&auto=format&fit=crop'; 

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar */}
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-blue-600 text-sm hover:underline cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                                            #{order.id.slice(0, 8).toUpperCase()}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                                        <div className="text-xs text-gray-400">{order.customerEmail || order.customerPhone}</div>
                                                    </div>
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
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-gray-400 hover:text-blue-600 font-medium text-sm transition-colors"
                                                >
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredOrders.length === 0 && (
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

                {/* Pagination (Mock) */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Hiển thị <span className="font-medium text-gray-900">1-{filteredOrders.length}</span> trong số <span className="font-medium text-gray-900">{totalOrders}</span> đơn hàng
                    </p>
                    <div className="flex items-center gap-2">
                         <button className="p-2 border border-gray-300 rounded hover:bg-white text-gray-400 hover:text-gray-600 disabled:opacity-50">
                            <ChevronLeftIcon />
                         </button>
                         <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm font-bold shadow-sm">1</button>
                         <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 rounded text-sm text-gray-600">2</button>
                         <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 rounded text-sm text-gray-600">3</button>
                         <span className="text-gray-400 text-sm">...</span>
                         <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 rounded text-sm text-gray-600">24</button>
                         <button className="p-2 border border-gray-300 rounded hover:bg-white text-gray-600 hover:text-black">
                            <ChevronRightIcon />
                         </button>
                    </div>
                </div>
            </div>

            {/* Modal Detail */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Đơn hàng #{selectedOrder.id.slice(0, 8).toUpperCase()}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Đặt ngày {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)} 
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-gray-400 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            {/* Status Bar */}
                            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8">
                                <span className="text-blue-800 text-sm font-medium">Trạng thái hiện tại: <span className="font-bold uppercase ml-1">{getStatusText(selectedOrder.status)}</span></span>
                                {/* Mock Action Buttons */}
                                <div className="flex gap-2">
                                    <button className="bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded text-xs font-bold hover:bg-blue-100">Cập nhật trạng thái</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                                <div>
                                    <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-4">Khách hàng</h4>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-lg font-bold text-gray-500">
                                            {selectedOrder.customerName[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                                            <p className="text-sm text-gray-500 mt-1">{selectedOrder.customerEmail}</p>
                                            <p className="text-sm text-gray-500">{selectedOrder.customerPhone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-4">Địa chỉ giao hàng</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 leading-relaxed">
                                        <p className="font-medium text-gray-900 mb-1">{selectedOrder.customerName}</p>
                                        <p>{selectedOrder.addressDetail}</p>
                                        <p>{selectedOrder.ward}, {selectedOrder.district}</p>
                                        <p>{selectedOrder.city}</p>
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
                                        {selectedOrder.items.map((item, idx) => (
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
                                            <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">{formatCurrency(selectedOrder.totalAmount)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {selectedOrder.note && (
                                <div className="mt-6">
                                    <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-2">Ghi chú từ khách hàng</h4>
                                    <p className="text-sm text-gray-600 italic bg-yellow-50 p-3 border border-yellow-100 rounded">"{selectedOrder.note}"</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                             <button className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">In hóa đơn</button>
                             <button 
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 shadow-lg shadow-gray-300"
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
