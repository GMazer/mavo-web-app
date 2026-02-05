
import React, { useState } from 'react';
import { Category } from '../../types';
import { Spinner } from '../ui/Icons';

interface CategoryFormProps {
    initialData: Category | null;
    onClose: () => void;
    onSave: (data: Category) => Promise<void>;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onClose, onSave }) => {
    const [formData, setFormData] = useState<Category>(
        initialData || { id: '', name: '', slug: '', description: '' }
    );
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">
                        {initialData?.id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                        ✕
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên danh mục *</label>
                        <input 
                            type="text" 
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="Nhập tên danh mục..."
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">
                            Slug (Đường dẫn) <span className="font-normal text-gray-400 text-xs ml-1">(Tự động tạo nếu để trống)</span>
                        </label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-mono text-gray-600 bg-gray-50"
                            placeholder="ví-dụ-nhu-the-nay"
                            value={formData.slug}
                            onChange={e => setFormData({...formData, slug: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả</label>
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all min-h-[100px]"
                            placeholder="Mô tả ngắn về danh mục này..."
                            value={formData.description || ''}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-2">
                         <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="flex-1 px-4 py-2.5 text-sm font-bold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-400/20"
                        >
                            {saving && <Spinner />}
                            {saving ? 'Đang lưu...' : 'Lưu danh mục'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
