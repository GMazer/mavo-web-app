
import React, { useEffect, useState } from 'react';
import { fetchOrdersApi, fetchProductsApi, updateOrderStatusApi } from '../services/api'; 
import { 
    Spinner, MagnifyingGlassIcon, CalendarIcon, FunnelIcon, 
    ArrowDownTrayIcon, PlusIcon, ShoppingBagIcon, ClockIcon, 
    TruckIcon, CheckBadgeIcon, ChevronLeftIcon, ChevronRightIcon, BellIcon,
    TrashIcon
} from '../components/ui/Icons';
import { formatCurrency } from '../utils/helpers';
import { Product } from '../types';

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
    const [products, setProducts] = useState<Product[]>([]); 
    const [loading, setLoading] = useState(false);
    
    // UI States
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Status Update State
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [tempStatus, setTempStatus] = useState<string>('');

    // Filters
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    // Create Order Form State
    const [newOrder, setNewOrder] = useState({
        customerName: '',
        customerPhone: '',
        address: '',
        items: [] as { productId: string, quantity: number, size: string }[]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [ordersData, productsData] = await Promise.all([
                fetchOrdersApi(),
                fetchProductsApi()
            ]);
            setOrders(ordersData);
            setProducts(productsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Filter Logic ---
    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerPhone.includes(searchTerm);
        
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus.toLowerCase();
        
        let matchesDate = true;
        if (dateRange.start) {
            // Start of day
            const startDate = new Date(dateRange.start);
            startDate.setHours(0, 0, 0, 0);
            matchesDate = matchesDate && new Date(order.createdAt) >= startDate;
        }
        if (dateRange.end) {
            // End of day
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            matchesDate = matchesDate && new Date(order.createdAt) <= endDate;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    // --- Statistics ---
    const totalOrders = orders.length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const shippingCount = orders.filter(o => o.status === 'processing').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;

    // --- Export CSV (UTF-8 Fix) ---
    const handleExportCSV = () => {
        const headers = ["Mã đơn", "Khách hàng", "Số điện thoại", "Ngày đặt", "Tổng tiền", "Trạng thái", "Địa chỉ"];
        const rows = filteredOrders.map(o => [
            `"${o.id}"`, 
            `"${o.customerName}"`,
            `"${o.customerPhone}"`,
            `"${new Date(o.createdAt).toLocaleDateString('vi-VN')}"`,
            `${o.totalAmount}`,
            `"${getStatusText(o.status)}"`,
            `"${o.addressDetail}, ${o.ward}, ${o.district}, ${o.city}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", `don_hang_mavo_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Create Order Logic ---
    const handleAddItemToNewOrder = () => {
        if (products.length > 0) {
            setNewOrder(prev => ({
                ...prev,
                items: [...prev.items, { productId: products[0].id, quantity: 1, size: 'M' }]
            }));
        }
    };

    const handleSubmitNewOrder = async () => {
        alert("Tính năng tạo đơn đang được cập nhật phía Backend API.");
        setIsCreateModalOpen(false);
    };

    // --- Update Status Logic ---
    const handleOpenDetail = (order: Order) => {
        setSelectedOrder(order);
        setTempStatus(order.status);
    };

    const handleSaveStatus = async () => {
        if (!selectedOrder) return;
        setIsUpdatingStatus(true);
        try {
            await updateOrderStatusApi(selectedOrder.id, tempStatus);
            
            // Update local state
            const updatedOrder = { ...selectedOrder, status: tempStatus };
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
            setSelectedOrder(updatedOrder);
            
            alert("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error(error);
            alert("Lỗi khi cập nhật trạng thái.");
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

    // Format date for display in button
    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="space-y-8 animate-fade-in font-sans pb-20 relative">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h2>
                    <p className="text-sm text-gray-500 mt-1">Theo dõi và xử lý các đơn đặt hàng mới nhất.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Fixed Search Bar UI */}
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

            {/* Stats Cards - Updated Icon for Total Orders */}
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

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 z-10 relative">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* FIXED DATE PICKER UI - Floating Popup Style */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm whitespace-nowrap transition-colors shadow-sm ${
                                (dateRange.start || dateRange.end) 
                                    ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black'
                            }`}
                        >
                            <CalendarIcon />
                            <span>
                                {dateRange.start || dateRange.end 
                                    ? `${formatDateDisplay(dateRange.start)} - ${formatDateDisplay(dateRange.end)}` 
                                    : 'Lọc theo ngày'
                                }
                            </span>
                        </button>
                        
                        {/* Floating Popup with Backdrop */}
                        {showDatePicker && (
                            <>
                                {/* Invisible Backdrop to close on click outside */}
                                <div 
                                    className="fixed inset-0 z-20 cursor-default" 
                                    onClick={() => setShowDatePicker(false)}
                                ></div>

                                {/* Popup Content */}
                                <div className="absolute top-full left-0 mt-3 bg-white border border-gray-100 shadow-2xl rounded-xl p-5 w-80 z-30 animate-fade-in ring-1 ring-black/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-sm text-gray-800">Khoảng thời gian</h4>
                                        <button onClick={() => setShowDatePicker(false)} className="text-gray-400 hover:text-black">✕</button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Từ ngày</label>
                                            <input 
                                                type="date" 
                                                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all cursor-pointer"
                                                value={dateRange.start}
                                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Đến ngày</label>
                                            <input 
                                                type="date" 
                                                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all cursor-pointer"
                                                value={dateRange.end}
                                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                            />
                                        </div>
                                        
                                        <div className="flex justify-end items-center gap-3 pt-3 border-t border-gray-100 mt-2">
                                            <button 
                                                onClick={() => { setDateRange({start: '', end: ''}); }}
                                                className="text-xs text-gray-500 hover:text-red-600 font-medium px-2"
                                            >
                                                Xóa
                                            </button>
                                            <button 
                                                onClick={() => setShowDatePicker(false)}
                                                className="text-xs bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md"
                                            >
                                                Áp dụng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    
                    <div className="relative">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 pr-8 cursor-pointer focus:outline-none shadow-sm"
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
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 w-full md:w-auto justify-center hover:border-black transition-colors shadow-sm"
                    >
                        <ArrowDownTrayIcon />
                        <span>Xuất Excel</span>
                    </button>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 w-full md:w-auto justify-center shadow-lg shadow-gray-400/20 transition-all active:scale-95"
                    >
                        <PlusIcon />
                        <span>Tạo đơn mới</span>
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
                                        <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
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
                                    const firstItem = order.items[0]; 
                                    const productImage = 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=100&auto=format&fit=crop'; 

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => handleOpenDetail(order)}>
                                            <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                                <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
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

                {/* Pagination (Static) */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Hiển thị <span className="font-medium text-gray-900">1-{filteredOrders.length}</span> trong số <span className="font-medium text-gray-900">{totalOrders}</span> đơn hàng
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

            {/* Create Order Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Tạo đơn hàng mới</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-black">✕</button>
                        </div>
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
                                    <input type="text" className="w-full border p-2 rounded" placeholder="Nhập tên khách hàng" 
                                        value={newOrder.customerName} onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                    <input type="text" className="w-full border p-2 rounded" placeholder="Số điện thoại"
                                        value={newOrder.customerPhone} onChange={e => setNewOrder({...newOrder, customerPhone: e.target.value})} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng</label>
                                    <input type="text" className="w-full border p-2 rounded" placeholder="Địa chỉ chi tiết..."
                                        value={newOrder.address} onChange={e => setNewOrder({...newOrder, address: e.target.value})} />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-sm">Sản phẩm</h4>
                                    <button onClick={handleAddItemToNewOrder} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">+ Thêm dòng</button>
                                </div>
                                {newOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <select 
                                            className="flex-1 border p-2 rounded text-sm"
                                            value={item.productId}
                                            onChange={e => {
                                                const newItems = [...newOrder.items];
                                                newItems[idx].productId = e.target.value;
                                                setNewOrder({...newOrder, items: newItems});
                                            }}
                                        >
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <input type="number" className="w-16 border p-2 rounded text-sm" value={item.quantity} 
                                            onChange={e => {
                                                const newItems = [...newOrder.items];
                                                newItems[idx].quantity = Number(e.target.value);
                                                setNewOrder({...newOrder, items: newItems});
                                            }}
                                        />
                                        <button 
                                            onClick={() => setNewOrder(prev => ({...prev, items: prev.items.filter((_, i) => i !== idx)}))}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                                {newOrder.items.length === 0 && <p className="text-sm text-gray-400 italic">Chưa có sản phẩm nào được chọn.</p>}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-white border rounded text-sm font-medium">Hủy</button>
                            <button onClick={handleSubmitNewOrder} className="px-6 py-2 bg-black text-white rounded text-sm font-bold hover:bg-gray-800">Tạo đơn hàng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Detail Modal */}
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
                                <span className="text-blue-800 text-sm font-medium flex items-center gap-2">
                                    Trạng thái: 
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusStyle(selectedOrder.status)}`}>
                                        {getStatusText(selectedOrder.status)}
                                    </span>
                                </span>
                                
                                <div className="flex items-center gap-2">
                                    <select 
                                        className="text-xs border border-blue-300 rounded px-2 py-1.5 bg-white text-gray-700 outline-none focus:border-blue-500"
                                        value={tempStatus || selectedOrder.status}
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
                                            <p className="font-bold text-gray-900 text-lg">{selectedOrder.customerName}</p>
                                            <p className="text-sm text-gray-500 mt-1">{selectedOrder.customerEmail}</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{selectedOrder.customerPhone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-4">Địa chỉ giao hàng</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 leading-relaxed">
                                        <p>{selectedOrder.addressDetail}</p>
                                        <p>{selectedOrder.ward}, {selectedOrder.district}</p>
                                        <p className="font-bold mt-1">{selectedOrder.city}</p>
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
