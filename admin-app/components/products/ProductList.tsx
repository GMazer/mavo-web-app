
import React, { useState } from 'react';
import { Product } from '../../types';
import { PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons';
import { formatCurrency } from '../../utils/helpers';

interface ProductListProps {
    products: Product[];
    loading: boolean;
    onEdit: (product: Product) => void;
    onToggleVisibility: (product: Product) => void;
    onDelete: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, onEdit, onToggleVisibility, onDelete }) => {
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    
    // Pagination Logic
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 gap-2">
                Loading...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center text-gray-500 py-20">
                Không tìm thấy sản phẩm nào.
            </div>
        );
    }

    // Helper for Stock Bar Color
    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Hết hàng', color: 'bg-red-500', text: 'text-red-500', bg: 'bg-red-100', width: '0%' };
        if (stock < 10) return { label: 'Sắp hết', color: 'bg-orange-500', text: 'text-orange-500', bg: 'bg-orange-100', width: '30%' };
        return { label: 'Còn hàng', color: 'bg-green-500', text: 'text-green-500', bg: 'bg-green-100', width: `${Math.min(stock, 100)}%` };
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wider font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </th>
                            <th className="px-6 py-4">Sản phẩm</th>
                            <th className="px-6 py-4">Danh mục</th>
                            <th className="px-6 py-4">Giá</th>
                            <th className="px-6 py-4 w-48">Tồn kho</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentProducts.map(product => {
                            const thumb = product.images?.[0] || product.thumbnailUrl;
                            const isVisible = product.isVisible !== false;
                            const stock = product.stock || 0;
                            const stockInfo = getStockStatus(stock);

                            return (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                {thumb ? (
                                                    <img src={thumb} alt="" className={`w-full h-full object-cover ${!isVisible ? 'grayscale' : ''}`} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold">N/A</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">SKU: {product.sku || '---'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded border border-gray-200">
                                            {product.category || 'Mặc định'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-sm text-gray-900">
                                        {formatCurrency(product.price)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-gray-700">{stock}</span>
                                                <span className={`text-[10px] font-medium ${stockInfo.text}`}>{stockInfo.label}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div className={`${stockInfo.color} h-1.5 rounded-full transition-all duration-500`} style={{ width: stockInfo.width }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleVisibility(product);
                                                }}
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                                                    isVisible ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                                                        isVisible ? 'translate-x-4' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                            <span className="text-xs text-gray-500">{isVisible ? 'Hoạt động' : 'Ẩn'}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onEdit(product)} className="text-gray-400 hover:text-blue-600 p-1 bg-white hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-all" title="Chỉnh sửa">
                                                <PencilIcon />
                                            </button>
                                            <button onClick={() => onDelete(product)} className="text-gray-400 hover:text-red-600 p-1 bg-white hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-all" title="Xóa">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                    Hiển thị <span className="font-bold text-gray-900">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, products.length)}</span> của <span className="font-bold text-gray-900">{products.length}</span> sản phẩm
                </span>
                <div className="flex items-center gap-2">
                     <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <ChevronLeftIcon />
                     </button>
                     
                     {[...Array(totalPages)].map((_, idx) => (
                         <button 
                            key={idx}
                            onClick={() => handlePageChange(idx + 1)}
                            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold transition-colors ${
                                currentPage === idx + 1 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                         >
                            {idx + 1}
                         </button>
                     ))}

                     <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <ChevronRightIcon />
                     </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
