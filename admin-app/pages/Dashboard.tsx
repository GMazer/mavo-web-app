
import React, { useEffect, useState } from 'react';
import { 
    CurrencyDollarIcon, ShoppingBagIcon, UserGroupIcon, ClipboardDocumentListIcon,
    ArrowTrendingUpIcon, ArrowTrendingDownIcon, EllipsisHorizontalIcon, CalendarIcon, BellIcon, Spinner
} from '../components/ui/Icons';
import { formatCurrency } from '../utils/helpers';
import { fetchDashboardDataApi } from '../services/api';

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({
        stats: {},
        chart: [],
        topCategories: [],
        topProducts: [],
        recentOrders: [],
        totalProducts: 0
    });

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const res = await fetchDashboardDataApi();
                setData(res);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;

    const { stats, chart, topCategories, topProducts, recentOrders, totalProducts } = data;

    // Stats Config
    const STATS = [
        { 
            title: "Tổng doanh thu", 
            value: stats.totalRevenue || 0, 
            trend: 0, 
            isUp: true, 
            icon: <CurrencyDollarIcon />, 
            color: "bg-green-100 text-green-600",
            format: true 
        },
        { 
            title: "Tổng đơn hàng", 
            value: stats.totalOrders || 0, 
            trend: 0, 
            isUp: true, 
            icon: <ShoppingBagIcon />, 
            color: "bg-blue-100 text-blue-600",
            format: false 
        },
        { 
            title: "Khách hàng", 
            value: stats.newCustomers || 0, 
            trend: 0, 
            isUp: true, 
            icon: <UserGroupIcon />, 
            color: "bg-purple-100 text-purple-600",
            format: false 
        },
        { 
            title: "Giá trị đơn TB", 
            value: stats.avgOrderValue || 0, 
            trend: 0, 
            isUp: true, 
            icon: <ClipboardDocumentListIcon />, 
            color: "bg-orange-100 text-orange-600",
            format: true 
        },
    ];

    // Helper to generate chart path
    const getChartPath = (width: number, height: number, dataPoints: any[]) => {
        if (!dataPoints || dataPoints.length === 0) return { line: "", area: "" };
        const maxVal = Math.max(...dataPoints.map((d: any) => d.value), 100); // Avoid div by 0
        const stepX = width / (dataPoints.length - 1 || 1);
        
        const points = dataPoints.map((d: any, i: number) => {
            const x = i * stepX;
            const y = height - (d.value / maxVal) * height; // Invert Y
            return `${x},${y}`;
        }).join(" ");

        // For fill area, add bottom corners
        const fillPoints = `0,${height} ${points} ${width},${height}`;
        
        return { line: `M${points.replace(/ /g, " L")}`, area: `M${fillPoints.replace(/ /g, " L")} Z` };
    };

    const chartPath = getChartPath(450, 180, chart);

    // Helper for Pie Chart Gradient
    const getConicGradient = (cats: any[]) => {
        if (!cats || cats.length === 0) return '#e5e7eb'; // Gray if empty
        let gradientStr = '';
        let currentPercent = 0;
        const colors = ['#3B82F6', '#22C55E', '#EAB308', '#6B7280', '#F97316'];

        cats.forEach((cat, idx) => {
            const endPercent = currentPercent + cat.percent;
            gradientStr += `${colors[idx % colors.length]} ${currentPercent}% ${endPercent}%, `;
            currentPercent = endPercent;
        });
        
        // Fill remaining with gray if < 100%
        if (currentPercent < 100) {
            gradientStr += `#e5e7eb ${currentPercent}% 100%`;
        } else {
            gradientStr = gradientStr.slice(0, -2);
        }

        return `conic-gradient(${gradientStr})`;
    };

    const pieColors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-gray-500'];

    return (
        <div className="space-y-6 pb-10">
            {/* Header Toolbar */}
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
                             {/* Mock Trend for now as backend doesn't calculate history diff yet */}
                            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600`}>
                                --%
                            </span>
                            <span className="text-xs text-gray-400">vs tháng trước</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Revenue Chart (Dynamic SVG) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Doanh thu (7 ngày gần nhất)</h3>
                        <button className="text-gray-400 hover:text-gray-600"><EllipsisHorizontalIcon /></button>
                    </div>
                    
                    <div className="relative h-64 w-full">
                         {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400">
                            {[100, 75, 50, 25, 0].map((val) => (
                                <div key={val} className="flex items-center gap-2 w-full">
                                    <span className="w-6 text-right opacity-0">{val}%</span> {/* Hidden scale for now */}
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Line Chart Path */}
                        {chart.length > 0 ? (
                            <svg className="absolute inset-0 w-full h-full pt-2 pl-2 pb-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 450 180">
                                <defs>
                                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d={chartPath.area} 
                                    fill="url(#gradient)" 
                                />
                                <path 
                                    d={chartPath.line} 
                                    fill="none" 
                                    stroke="#3B82F6" 
                                    strokeWidth="3" 
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Chưa có dữ liệu</div>
                        )}

                         {/* X Axis Labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 pt-2">
                            {chart.map((c: any, i: number) => (
                                <span key={i}>{new Date(c.date).toLocaleDateString('vi-VN', {weekday: 'short'})}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Categories Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-6">Phân bố sản phẩm</h3>
                    
                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Donut Chart */}
                        <div 
                            className="w-48 h-48 rounded-full relative transition-all duration-500"
                            style={{ background: getConicGradient(topCategories) }}
                        >
                            <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center z-10">
                                <span className="text-2xl font-bold text-gray-800">{totalProducts}</span>
                                <span className="text-xs text-gray-500">Sản phẩm</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {topCategories.map((cat: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${pieColors[idx % pieColors.length]}`}></span>
                                    <span className="text-gray-600 truncate max-w-[120px]" title={cat.name}>{cat.name}</span>
                                </div>
                                <span className="font-bold text-gray-700">{cat.percent}%</span>
                            </div>
                        ))}
                        {topCategories.length === 0 && <p className="text-center text-gray-400 text-xs">Chưa có danh mục</p>}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Top Selling Products */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Top sản phẩm bán chạy</h3>
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
                                {topProducts.map((p: any) => (
                                    <tr key={p.id || Math.random()} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-10 h-12 bg-gray-100 rounded border border-gray-100 flex-shrink-0">
                                                {p.img && <img src={p.img} className="w-full h-full object-cover rounded" alt="" />}
                                            </div>
                                            <span className="font-medium text-gray-800 line-clamp-1" title={p.name}>{p.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{formatCurrency(p.price)}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{p.sold}</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-800">{formatCurrency(p.revenue)}</td>
                                    </tr>
                                ))}
                                {topProducts.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-400">Chưa có dữ liệu bán hàng</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Đơn hàng mới</h3>
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
                                {recentOrders.map((o: any) => {
                                    let statusColor = "bg-gray-100 text-gray-600";
                                    let statusText = o.status;
                                    if(o.status === 'completed') { statusColor = "bg-green-100 text-green-700"; statusText="Hoàn thành"; }
                                    if(o.status === 'processing') { statusColor = "bg-blue-100 text-blue-700"; statusText="Đang giao"; }
                                    if(o.status === 'pending') { statusColor = "bg-yellow-100 text-yellow-700"; statusText="Chờ xử lý"; }
                                    if(o.status === 'cancelled') { statusColor = "bg-red-100 text-red-700"; statusText="Đã hủy"; }

                                    return (
                                        <tr key={o.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-4 font-medium text-blue-600">#{o.id.slice(0, 8)}</td>
                                            <td className="px-5 py-4 text-gray-800 truncate max-w-[120px]">{o.customer}</td>
                                            <td className="px-5 py-4 text-right">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${statusColor}`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {recentOrders.length === 0 && (
                                    <tr><td colSpan={3} className="text-center py-8 text-gray-400">Chưa có đơn hàng</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
