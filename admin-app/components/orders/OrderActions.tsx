
import React from 'react';
import { 
    CalendarIcon, FunnelIcon, ArrowDownTrayIcon, PlusIcon, Spinner 
} from '../ui/Icons';

interface OrderActionsProps {
    // Selection Mode
    selectedCount: number;
    onClearSelection: () => void;
    
    // Bulk Update
    bulkStatus: string;
    setBulkStatus: (status: string) => void;
    onBulkUpdate: () => void;
    isBulkUpdating: boolean;

    // Filters & Actions
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    dateRange: { start: string, end: string };
    setDateRange: (range: { start: string, end: string }) => void;
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    
    onExportCSV: () => void;
    onCreateClick: () => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({
    selectedCount,
    onClearSelection,
    bulkStatus,
    setBulkStatus,
    onBulkUpdate,
    isBulkUpdating,
    filterStatus,
    setFilterStatus,
    dateRange,
    setDateRange,
    showDatePicker,
    setShowDatePicker,
    onExportCSV,
    onCreateClick
}) => {
    
    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    // --- BULK ACTION MODE ---
    if (selectedCount > 0) {
        return (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 z-10 relative animate-fade-in">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-blue-800 text-sm">Đã chọn {selectedCount} đơn hàng</span>
                    <div className="h-4 w-px bg-blue-200"></div>
                    <button 
                        onClick={onClearSelection} 
                        className="text-xs text-blue-600 hover:text-red-500 font-medium underline"
                    >
                        Bỏ chọn
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-blue-800 font-medium">Đổi trạng thái thành:</span>
                    <select 
                        value={bulkStatus}
                        onChange={(e) => setBulkStatus(e.target.value)}
                        className="bg-white border border-blue-300 rounded-lg text-sm py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700"
                    >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang giao</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <button 
                        onClick={onBulkUpdate}
                        disabled={isBulkUpdating}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        {isBulkUpdating && <Spinner />}
                        {isBulkUpdating ? 'Đang xử lý...' : 'Cập nhật'}
                    </button>
                </div>
            </div>
        );
    }

    // --- NORMAL MODE ---
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 z-10 relative">
            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Date Picker */}
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
                    
                    {showDatePicker && (
                        <>
                            <div className="fixed inset-0 z-20 cursor-default" onClick={() => setShowDatePicker(false)}></div>
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
                
                {/* Status Filter */}
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
                    onClick={onExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 w-full md:w-auto justify-center hover:border-black transition-colors shadow-sm"
                >
                    <ArrowDownTrayIcon />
                    <span>Xuất Excel</span>
                </button>
                <button 
                    onClick={onCreateClick}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 w-full md:w-auto justify-center shadow-lg shadow-gray-400/20 transition-all active:scale-95"
                >
                    <PlusIcon />
                    <span>Tạo đơn mới</span>
                </button>
            </div>
        </div>
    );
};

export default OrderActions;
