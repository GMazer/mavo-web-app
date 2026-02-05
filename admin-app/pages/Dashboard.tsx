
import React from 'react';
import { 
    CurrencyDollarIcon, ShoppingBagIcon, UserGroupIcon, ClipboardDocumentListIcon,
    ArrowTrendingUpIcon, ArrowTrendingDownIcon, EllipsisHorizontalIcon, CalendarIcon, BellIcon
} from '../components/ui/Icons';
import { formatCurrency } from '../../utils/helpers';

// Mock Data
const STATS = [
    { 
        title: "Tổng doanh thu", 
        value: 124592000, 
        trend: 12.5, 
        isUp: true, 
        icon: <CurrencyDollarIcon />, 
        color: "bg-green-100 text-green-600",
        format: true 
    },
    { 
        title: "Tổng đơn hàng", 
        value: 1482, 
        trend: 8.2, 
        isUp: true, 
        icon: <ShoppingBagIcon />, 
        color: "bg-blue-100 text-blue-600",
        format: false 
    },
    { 
        title: "Khách hàng mới", 
        value: 342, 
        trend: 15.3, 
        isUp: true, 
        icon: <UserGroupIcon />, 
        color: "bg-purple-100 text-purple-600",
        format: false 
    },
    { 
        title: "Giá trị đơn trung bình", 
        value: 845000, 
        trend: 2.1, 
        isUp: false, 
        icon: <ClipboardDocumentListIcon />, 
        color: "bg-orange-100 text-orange-600",
        format: true 
    },
];

const TOP_PRODUCTS = [
    { id: 1, name: "Váy Lụa Dự Tiệc", price: 2100000, sold: 245, revenue: 514500000, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&q=80" },
    { id: 2, name: "Áo Blazer Đen", price: 1250000, sold: 180, revenue: 225000000, img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100&q=80" },
    { id: 3, name: "Quần Jeans Ống Rộng", price: 850000, sold: 156, revenue: 132600000, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&q=80" },
    { id: 4, name: "Túi Xách Da Mềm", price: 3200000, sold: 98, revenue: 313600000, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&q=80" },
];

const RECENT_ORDERS = [
    { id: "#ORD-009", customer: "Alice Nguyễn", status: "completed", amount: 1200000 },
    { id: "#ORD-010", customer: "Trần Văn B", status: "processing", amount: 850000 },
    { id: "#ORD-011", customer: "Lê Thị C", status: "pending", amount: 2100000 },
    { id: "#ORD-012", customer: "Phạm D", status: "cancelled", amount: 500000 },
];

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6 pb-10">
            {/* Header Toolbar (Replaces the generic tab title in Sidebar layout if needed, but here acts as sub-header) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800">Tổng quan Dashboard</h2>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
                        <CalendarIcon />
                        <span>30 ngày qua</span>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-black bg-white border border-gray-200 rounded-lg shadow-sm transition-colors relative">
                        <BellIcon />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {stat.format ? formatCurrency(stat.value).replace('₫', '') : stat.value.toLocaleString()}
                                    {stat.format && <span className="text-sm font-normal text-gray-500 ml-1">₫</span>}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.isUp ? <ArrowTrendingUpIcon /> : <ArrowTrendingDownIcon />}
                                {stat.trend}%
                            </span>
                            <span className="text-xs text-gray-400">vs tháng trước</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Revenue Chart (Mock SVG) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Biểu đồ doanh thu</h3>
                        <button className="text-gray-400 hover:text-gray-600"><EllipsisHorizontalIcon /></button>
                    </div>
                    
                    <div className="relative h-64 w-full">
                         {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400">
                            {[40, 30, 20, 10, 0].map((val) => (
                                <div key={val} className="flex items-center gap-2 w-full">
                                    <span className="w-6 text-right">${val}k</span>
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Line Chart Path */}
                        <svg className="absolute inset-0 w-full h-full pt-2 pl-8 pb-6 overflow-visible" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path 
                                d="M0,180 C50,160 100,170 150,130 C200,90 250,110 300,80 C350,50 400,60 450,40 L450,220 L0,220 Z" 
                                fill="url(#gradient)" 
                            />
                            <path 
                                d="M0,180 C50,160 100,170 150,130 C200,90 250,110 300,80 C350,50 400,60 450,40" 
                                fill="none" 
                                stroke="#3B82F6" 
                                strokeWidth="3" 
                                strokeLinecap="round"
                            />
                        </svg>

                         {/* X Axis Labels */}
                        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-400 pt-2">
                            <span>Thứ 2</span>
                            <span>Thứ 3</span>
                            <span>Thứ 4</span>
                            <span>Thứ 5</span>
                            <span>Thứ 6</span>
                            <span>Thứ 7</span>
                            <span>CN</span>
                        </div>
                    </div>
                </div>

                {/* Top Categories Chart (CSS Conic Gradient) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-6">Danh mục hàng đầu</h3>
                    
                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Donut Chart */}
                        <div 
                            className="w-48 h-48 rounded-full relative"
                            style={{
                                background: `conic-gradient(
                                    #3B82F6 0% 35%, 
                                    #22C55E 35% 60%, 
                                    #EAB308 60% 80%, 
                                    #6B7280 80% 100%
                                )`
                            }}
                        >
                            <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center z-10">
                                <span className="text-2xl font-bold text-gray-800">5.4k</span>
                                <span className="text-xs text-gray-500">Sản phẩm</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span className="text-gray-600">Thời trang Nữ</span>
                            </div>
                            <span className="font-bold text-gray-700">35%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                <span className="text-gray-600">Thời trang Nam</span>
                            </div>
                            <span className="font-bold text-gray-700">25%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                <span className="text-gray-600">Phụ kiện</span>
                            </div>
                            <span className="font-bold text-gray-700">20%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                                <span className="text-gray-600">Khác</span>
                            </div>
                            <span className="font-bold text-gray-700">20%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Top Selling Products */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Sản phẩm bán chạy</h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline">Xem tất cả</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3">Sản phẩm</th>
                                    <th className="px-6 py-3">Giá</th>
                                    <th className="px-6 py-3 text-center">Đã bán</th>
                                    <th className="px-6 py-3 text-right">Doanh thu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {TOP_PRODUCTS.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <img src={p.img} className="w-10 h-12 object-cover rounded border border-gray-100" alt="" />
                                            <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{formatCurrency(p.price)}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{p.sold}</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-800">{formatCurrency(p.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Đơn hàng gần đây</h3>
                        <button className="text-gray-400 hover:text-gray-600"><EllipsisHorizontalIcon /></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                                <tr>
                                    <th className="px-5 py-3">Mã đơn</th>
                                    <th className="px-5 py-3">Khách hàng</th>
                                    <th className="px-5 py-3 text-right">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {RECENT_ORDERS.map((o) => {
                                    let statusColor = "bg-gray-100 text-gray-600";
                                    let statusText = o.status;
                                    if(o.status === 'completed') { statusColor = "bg-green-100 text-green-700"; statusText="Hoàn thành"; }
                                    if(o.status === 'processing') { statusColor = "bg-blue-100 text-blue-700"; statusText="Đang giao"; }
                                    if(o.status === 'pending') { statusColor = "bg-yellow-100 text-yellow-700"; statusText="Chờ xử lý"; }
                                    if(o.status === 'cancelled') { statusColor = "bg-red-100 text-red-700"; statusText="Đã hủy"; }

                                    return (
                                        <tr key={o.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-4 font-medium text-blue-600">{o.id}</td>
                                            <td className="px-5 py-4 text-gray-800">{o.customer}</td>
                                            <td className="px-5 py-4 text-right">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${statusColor}`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
