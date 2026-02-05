
import React, { useEffect, useState } from 'react';
import { fetchOrdersApi, fetchProductsApi, updateOrderStatusApi, updateOrderStatusesApi } from '../services/api'; 
import { Product, Order } from '../types';

import OrderHeader from '../components/orders/OrderHeader';
import OrderStats from '../components/orders/OrderStats';
import OrderActions from '../components/orders/OrderActions';
import OrderTable from '../components/orders/OrderTable';
import CreateOrderModal from '../components/orders/CreateOrderModal';
import OrderDetailModal from '../components/orders/OrderDetailModal';

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]); 
    const [loading, setLoading] = useState(false);
    
    // UI States
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Selection State (Bulk Actions)
    const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
    const [bulkStatus, setBulkStatus] = useState('processing');
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    // Filters
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
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

    // --- Selection Logic ---
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Select all currently filtered orders
            const allIds = new Set(filteredOrders.map(o => o.id));
            setSelectedOrderIds(allIds);
        } else {
            setSelectedOrderIds(new Set());
        }
    };

    const handleSelectRow = (id: string) => {
        const newSelected = new Set(selectedOrderIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedOrderIds(newSelected);
    };

    const handleBulkUpdate = async () => {
        if (selectedOrderIds.size === 0) return;
        const getStatusText = (s: string) => {
             // Quick helper, reused from components for alert
             if(s === 'pending') return 'Chờ xử lý';
             if(s === 'processing') return 'Đang giao';
             if(s === 'completed') return 'Hoàn thành';
             if(s === 'cancelled') return 'Đã hủy';
             return s;
        }

        if (!window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái ${selectedOrderIds.size} đơn hàng thành "${getStatusText(bulkStatus)}"?`)) return;

        setIsBulkUpdating(true);
        try {
            const ids = Array.from(selectedOrderIds);
            await updateOrderStatusesApi(ids, bulkStatus);
            
            // Optimistic Update
            setOrders(prev => prev.map(o => ids.includes(o.id) ? { ...o, status: bulkStatus } : o));
            
            // Clear selection
            setSelectedOrderIds(new Set());
            alert("Cập nhật thành công!");
        } catch (error) {
            console.error(error);
            alert("Lỗi khi cập nhật hàng loạt.");
        } finally {
            setIsBulkUpdating(false);
        }
    };

    // --- Export CSV (UTF-8 Fix) ---
    const handleExportCSV = () => {
        const headers = ["Mã đơn", "Khách hàng", "Số điện thoại", "Ngày đặt", "Tổng tiền", "Trạng thái", "Địa chỉ"];
        const getStatusText = (s: string) => {
            if(s === 'pending') return 'Chờ xử lý';
            if(s === 'processing') return 'Đang giao';
            if(s === 'completed') return 'Hoàn thành';
            if(s === 'cancelled') return 'Đã hủy';
            return s;
        };
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

    // --- Update Status Logic (Single) ---
    const handleUpdateStatus = async (id: string, newStatus: string) => {
        await updateOrderStatusApi(id, newStatus);
        
        // Update local state
        const updatedOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
        setOrders(updatedOrders);
        
        // If detail modal is open, update its selection too
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }

        alert("Cập nhật trạng thái thành công!");
    };

    return (
        <div className="space-y-8 animate-fade-in font-sans pb-20 relative">
            <OrderHeader 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
            />

            <OrderStats orders={orders} />

            <OrderActions 
                selectedCount={selectedOrderIds.size}
                onClearSelection={() => setSelectedOrderIds(new Set())}
                bulkStatus={bulkStatus}
                setBulkStatus={setBulkStatus}
                onBulkUpdate={handleBulkUpdate}
                isBulkUpdating={isBulkUpdating}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                dateRange={dateRange}
                setDateRange={setDateRange}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                onExportCSV={handleExportCSV}
                onCreateClick={() => setIsCreateModalOpen(true)}
            />

            <OrderTable 
                orders={filteredOrders}
                totalOrders={orders.length}
                loading={loading}
                selectedOrderIds={selectedOrderIds}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectRow}
                onOpenDetail={setSelectedOrder}
            />

            <CreateOrderModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                products={products}
            />

            {selectedOrder && (
                <OrderDetailModal 
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
};

export default OrderManager;
