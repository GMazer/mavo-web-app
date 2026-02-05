
import React, { useState } from 'react';
import { Category } from '../../types';
import { PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, ArchiveBoxIcon } from '../ui/Icons';

interface CategoryListProps {
    categories: Category[];
    loading: boolean;
    onEdit: (cat: Category) => void;
    onDelete: (cat: Category) => void;
    onToggleStatus: (cat: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, loading, onEdit, onDelete, onToggleStatus }) => {
    // Pagination (Client side for now)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCategories = categories.slice(startIndex, startIndex + itemsPerPage);

    // Mock colors for category icons
    const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-green-100 text-green-600', 'bg-orange-100 text-orange-600', 'bg-pink-100 text-pink-600'];

    if (loading) return <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                            </th>
                            <th className="px-6 py-4">Tên danh mục</th>
                            <th className="px-6 py-4">Mô tả</th>
                            <th className="px-6 py-4">Số sản phẩm</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentCategories.map((cat, idx) => {
                            const colorClass = colors[idx % colors.length];
                            // Mock product count (random)
                            const productCount = Math.floor(Math.random() * 5000); 
                            const isVisible = cat.isVisible !== false; // Default true if undefined

                            return (
                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                                                <ArchiveBoxIcon />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{cat.name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">/{cat.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">{cat.description || 'Chưa có mô tả'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">
                                            {productCount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                         {/* Functional Active Switch */}
                                        <div 
                                            onClick={() => onToggleStatus(cat)}
                                            className="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in cursor-pointer"
                                        >
                                            <input 
                                                type="checkbox" 
                                                name={`toggle-${cat.id}`} 
                                                id={`toggle-${cat.id}`} 
                                                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                                                checked={isVisible}
                                                readOnly
                                                style={{
                                                    right: isVisible ? 0 : 'auto', 
                                                    left: isVisible ? 'auto' : 0,
                                                    borderColor: isVisible ? '#2563EB' : '#D1D5DB'
                                                }}
                                            />
                                            <label 
                                                htmlFor={`toggle-${cat.id}`} 
                                                className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${isVisible ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            ></label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onEdit(cat)} className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                                                <PencilIcon />
                                            </button>
                                            <button onClick={() => onDelete(cat)} className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-500">Chưa có danh mục nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <span className="text-sm text-gray-500">
                    Hiển thị <span className="font-bold text-gray-900">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, categories.length)}</span> của <span className="font-bold text-gray-900">{categories.length}</span> danh mục
                </span>
                <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-white text-gray-500 disabled:opacity-50"
                     >
                        <ChevronLeftIcon />
                     </button>
                     <button className="w-8 h-8 flex items-center justify-center bg-black text-white text-sm font-bold rounded-lg shadow-sm">
                        {currentPage}
                     </button>
                     <button 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-white text-gray-500 disabled:opacity-50"
                     >
                        <ChevronRightIcon />
                     </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
