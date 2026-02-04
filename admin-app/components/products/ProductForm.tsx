import React, { useState } from 'react';
import { Product } from '../../types';
import { Spinner } from '../ui/Icons';
import ProductImageGallery from './ProductImageGallery';
import { saveProductApi } from '../../services/api';

interface ProductFormProps {
    initialProduct: Product;
    onCancel: () => void;
    onSaved: (product: Product, isNew: boolean) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onCancel, onSaved }) => {
    const [product, setProduct] = useState<Product>(initialProduct);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleChange = (field: keyof Product, value: any) => {
        setProduct(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const savedProduct = await saveProductApi(product);
            onSaved(savedProduct, !product.id);
        } catch (err) {
            console.error(err);
            alert("Lưu thất bại!");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-lg font-bold">
                    {product.id ? `Chỉnh sửa: ${product.name}` : 'Tạo sản phẩm mới'}
                </h3>
                <button onClick={onCancel} className="text-sm text-gray-500 hover:text-black underline">Hủy bỏ</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                        <input 
                            type="text" 
                            value={product.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2" 
                            placeholder="Nhập tên sản phẩm..."
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea 
                            value={product.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 h-32"
                            placeholder="Mô tả chi tiết sản phẩm..."
                        ></textarea>
                    </div>
                    
                    {/* Image Gallery Component */}
                    <ProductImageGallery 
                        images={product.images} 
                        onImagesChange={(imgs) => handleChange('images', imgs)}
                        uploading={uploading}
                        setUploading={setUploading}
                    />
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                    <div className="bg-white border p-4 rounded-md shadow-sm">
                        <h4 className="font-bold text-sm mb-4">Giá bán (VND)</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500">Giá niêm yết</label>
                                <input 
                                    type="number" 
                                    value={product.price}
                                    onChange={(e) => handleChange('price', Number(e.target.value))}
                                    className="w-full border rounded p-2" 
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Giá gốc (Gạch)</label>
                                <input 
                                    type="number" 
                                    value={product.originalPrice || ''}
                                    onChange={(e) => handleChange('originalPrice', Number(e.target.value))}
                                    className="w-full border rounded p-2" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border p-4 rounded-md shadow-sm">
                        <h4 className="font-bold text-sm mb-4">Kho hàng & SKU</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500">Mã SKU</label>
                                <input 
                                    type="text" 
                                    value={product.sku || ''}
                                    onChange={(e) => handleChange('sku', e.target.value)}
                                    className="w-full border rounded p-2" 
                                    placeholder="SKU-..."
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Danh mục</label>
                                <select 
                                    value={product.category || 'Quần áo'}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="Quần áo">Quần áo</option>
                                    <option value="Váy đầm">Váy đầm</option>
                                    <option value="Áo">Áo</option>
                                    <option value="Quần">Quần</option>
                                    <option value="Chân váy">Chân váy</option>
                                    <option value="Set">Set</option>
                                    <option value="Jumpsuits">Jumpsuits</option>
                                    <option value="Áo khoác">Áo khoác</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={saving || uploading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {saving && <Spinner />}
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
