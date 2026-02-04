
import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { fetchCategoriesApi, saveCategoryApi, deleteCategoryApi } from '../services/api';
import { PencilIcon, TrashIcon, Spinner } from '../components/ui/Icons';

const CategoryManager: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [saving, setSaving] = useState(false);

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
            alert("Lỗi tải danh mục");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingCategory({ id: '', name: '', slug: '' });
        setIsFormOpen(true);
    };

    const handleEdit = (cat: Category) => {
        setEditingCategory(cat);
        setIsFormOpen(true);
    };

    const handleDelete = async (cat: Category) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) return;
        try {
            await deleteCategoryApi(cat.id);
            setCategories(prev => prev.filter(c => c.id !== cat.id));
        } catch (error) {
            alert("Lỗi khi xóa danh mục.");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        setSaving(true);
        try {
            const saved = await saveCategoryApi(editingCategory);
            if (editingCategory.id) {
                setCategories(prev => prev.map(c => c.id === saved.id ? saved : c));
            } else {
                setCategories(prev => [...prev, saved]);
            }
            setIsFormOpen(false);
            setEditingCategory(null);
        } catch (error) {
            alert("Lỗi lưu danh mục.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Quản lý Danh mục</h3>
                <button 
                    onClick={handleAddNew}
                    className="bg-black text-white px-4 py-2 text-sm font-bold uppercase rounded hover:bg-gray-800"
                >
                    + Thêm danh mục
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Đang tải...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Tên danh mục</th>
                                <th className="px-6 py-4">Slug (Đường dẫn)</th>
                                <th className="px-6 py-4">Mô tả</th>
                                <th className="px-6 py-4 w-24">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{cat.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{cat.description || '-'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button onClick={() => handleEdit(cat)} className="text-gray-400 hover:text-blue-600"><PencilIcon /></button>
                                            <button onClick={() => handleDelete(cat)} className="text-gray-400 hover:text-red-600"><TrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">Chưa có danh mục nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal / Form Overlay */}
            {isFormOpen && editingCategory && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl animate-fade-in">
                        <h3 className="text-lg font-bold mb-4">{editingCategory.id ? 'Sửa danh mục' : 'Thêm danh mục'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên danh mục *</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full border border-gray-300 rounded p-2"
                                    value={editingCategory.name}
                                    onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug (Tùy chọn)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded p-2 text-sm text-gray-600"
                                    placeholder="Tu dong tao tu ten neu de trong"
                                    value={editingCategory.slug}
                                    onChange={e => setEditingCategory({...editingCategory, slug: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded p-2"
                                    rows={3}
                                    value={editingCategory.description || ''}
                                    onChange={e => setEditingCategory({...editingCategory, description: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 flex items-center gap-2"
                                >
                                    {saving && <Spinner />} Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
