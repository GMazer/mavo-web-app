
import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { fetchCategoriesApi, saveCategoryApi, deleteCategoryApi } from '../services/api';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { 
    MagnifyingGlassIcon, PlusIcon, TagIcon, CheckBadgeIcon, ChartBarIcon, FunnelIcon 
} from '../components/ui/Icons';

const CategoryManager: React.FC = () => {
    const toast = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Delete State
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await fetchCategoriesApi();
            setCategories(data);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh mục");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: Category) => {
        try {
            const saved = await saveCategoryApi(data);
            if (data.id) {
                setCategories(prev => prev.map(c => c.id === saved.id ? saved : c));
                toast.success("Cập nhật danh mục thành công");
            } else {
                setCategories(prev => [...prev, saved]);
                toast.success("Tạo danh mục mới thành công");
            }
            setIsFormOpen(false);
            setEditingCategory(null);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi lưu danh mục");
        }
    };

    const initiateDelete = (cat: Category) => {
        setCategoryToDelete(cat);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        setIsDeleting(true);
        try {
            await deleteCategoryApi(categoryToDelete.id);
            setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
            toast.success("Đã xóa danh mục");
        } catch (error) {
            toast.error("Lỗi khi xóa danh mục");
        } finally {
            setIsDeleting(false);
            setCategoryToDelete(null);
        }
    };

    const handleToggleStatus = async (cat: Category) => {
        const newStatus = !(cat.isVisible !== false);
        const updatedCat = { ...cat, isVisible: newStatus };
        
        // Optimistic Update
        setCategories(prev => prev.map(c => c.id === cat.id ? updatedCat : c));

        try {
            await saveCategoryApi(updatedCat);
            toast.success(`Đã cập nhật trạng thái danh mục "${cat.name}"`);
        } catch (error) {
            console.error("Failed to toggle status", error);
            toast.error("Lỗi khi cập nhật trạng thái.");
            // Revert
            setCategories(prev => prev.map(c => c.id === cat.id ? cat : c));
        }
    };

    // Filter Logic
    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.slug.includes(searchTerm.toLowerCase())
    );

    // Stats
    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.isVisible !== false).length; 
    const popularCategory = categories.length > 0 ? categories[0].name : 'N/A';

    return (
        <div className="space-y-6 font-sans pb-10">
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Tổng danh mục</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{totalCategories}</h3>
                        <span className="text-blue-500 text-xs font-bold mt-1 inline-block">+2 Mới tháng này</span>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><TagIcon /></div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Đang hoạt động</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{activeCategories}</h3>
                        <span className="text-green-500 text-xs font-bold mt-1 inline-block">{totalCategories - activeCategories} Ngừng hoạt động</span>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckBadgeIcon /></div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Danh mục phổ biến</p>
                        <h3 className="text-xl font-bold text-gray-800 mt-3 truncate max-w-[150px]" title={popularCategory}>
                            {popularCategory}
                        </h3>
                        <span className="text-purple-500 text-xs font-bold mt-1 inline-block">5.4k Sản phẩm</span>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><ChartBarIcon /></div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px]">
                {/* TOOLBAR */}
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <MagnifyingGlassIcon />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm danh mục..." 
                                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full pl-10 p-2.5 outline-none transition-all shadow-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm">
                            <FunnelIcon />
                            <span className="hidden sm:inline">Lọc</span>
                        </button>
                    </div>

                    <button 
                        onClick={() => { setEditingCategory(null); setIsFormOpen(true); }}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 shadow-lg shadow-gray-400/20 transition-all active:scale-95 w-full md:w-auto justify-center"
                    >
                        <PlusIcon />
                        <span>Thêm danh mục mới</span>
                    </button>
                </div>

                {/* TABLE */}
                <CategoryList 
                    categories={filteredCategories}
                    loading={loading}
                    onEdit={(cat) => { setEditingCategory(cat); setIsFormOpen(true); }}
                    onDelete={initiateDelete}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            {/* MODAL FORM */}
            {isFormOpen && (
                <CategoryForm 
                    initialData={editingCategory}
                    onClose={() => { setIsFormOpen(false); setEditingCategory(null); }}
                    onSave={handleSave}
                />
            )}

            {/* CONFIRM DELETE MODAL */}
            <ConfirmModal
                isOpen={!!categoryToDelete}
                title="Xóa danh mục"
                message={`Bạn có chắc muốn xóa danh mục "${categoryToDelete?.name}"? Các sản phẩm thuộc danh mục này sẽ không bị xóa nhưng sẽ mất phân loại.`}
                confirmLabel="Xóa danh mục"
                type="danger"
                isLoading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setCategoryToDelete(null)}
            />
        </div>
    );
};

export default CategoryManager;
