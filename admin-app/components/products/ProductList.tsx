
import React from 'react';
import { Product } from '../../types';
import { PencilIcon, TrashIcon } from '../ui/Icons';
import { formatCurrency } from '../../utils/helpers';

interface ProductListProps {
    products: Product[];
    loading: boolean;
    onEdit: (product: Product) => void;
    onToggleVisibility: (product: Product) => void;
    onDelete: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, onEdit, onToggleVisibility, onDelete }) => {
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

    return (
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                    <th className="px-6 py-4">Tên sản phẩm</th>
                    <th className="px-6 py-4">Mã SKU</th>
                    <th className="px-6 py-4">Giá</th>
                    <th className="px-6 py-4">Hiển thị</th>
                    <th className="px-6 py-4">Hành động</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {products.map(product => {
                    const thumb = product.images?.[0] || product.thumbnailUrl;
                    const isVisible = product.isVisible !== false; // Default true if undefined

                    return (
                        <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${!isVisible ? 'bg-gray-50 opacity-75' : ''}`}>
                            <td className="px-6 py-4 font-medium flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                    {thumb ? (
                                        <img src={thumb} alt="" className={`w-full h-full object-cover ${!isVisible ? 'grayscale' : ''}`} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold bg-gray-100">N/A</div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span>{product.name}</span>
                                    <span className="text-[10px] text-gray-400">{product.images?.length || 0} ảnh</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                            <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                            
                            {/* Toggle Switch */}
                            <td className="px-6 py-4">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleVisibility(product);
                                    }}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                                        isVisible ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                >
                                    <span className="sr-only">Toggle visibility</span>
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                                            isVisible ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                                <span className="ml-2 text-xs text-gray-500">{isVisible ? 'Hiện' : 'Ẩn'}</span>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => onEdit(product)} className="text-gray-400 hover:text-blue-600" title="Chỉnh sửa">
                                        <PencilIcon />
                                    </button>
                                    <button onClick={() => onDelete(product)} className="text-gray-400 hover:text-red-600" title="Xóa">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default ProductList;
