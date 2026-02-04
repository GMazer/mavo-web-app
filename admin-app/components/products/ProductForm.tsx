
import React, { useState, useEffect } from 'react';
import { Product, Category, ProductColor } from '../../types';
import { Spinner, UploadIcon, TrashIcon } from '../ui/Icons';
import ProductImageGallery from './ProductImageGallery';
import { saveProductApi, uploadImagesApi, fetchCategoriesApi } from '../../services/api';

interface ProductFormProps {
    initialProduct: Product;
    onCancel: () => void;
    onSaved: (product: Product, isNew: boolean) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onCancel, onSaved }) => {
    const [product, setProduct] = useState<Product>(initialProduct);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingSize, setUploadingSize] = useState(false);
    
    // Categories
    const [categories, setCategories] = useState<Category[]>([]);

    // Local state for adding new color
    const [tempColorName, setTempColorName] = useState('');
    const [tempColorHex, setTempColorHex] = useState('#000000');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategoriesApi();
                setCategories(data);
            } catch (e) {
                console.error("Failed to load categories for select", e);
            }
        };
        loadCategories();
    }, []);

    const handleChange = (field: keyof Product, value: any) => {
        setProduct(prev => ({ ...prev, [field]: value }));
    };

    const handleAddColor = () => {
        if (!tempColorName.trim()) {
            alert("Vui lòng nhập tên màu!");
            return;
        }
        
        const newColor: ProductColor = {
            name: tempColorName.trim(),
            hex: tempColorHex
        };

        const currentColors = product.colors || [];
        handleChange('colors', [...currentColors, newColor]);
        
        // Reset inputs
        setTempColorName('');
        setTempColorHex('#000000');
    };

    const handleRemoveColor = (indexToRemove: number) => {
        const currentColors = product.colors || [];
        handleChange('colors', currentColors.filter((_, idx) => idx !== indexToRemove));
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

    const handleCustomSizeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingSize(true);
        try {
            const files = Array.from(e.target.files);
            const urls = await uploadImagesApi(files);
            if (urls.length > 0) {
                handleChange('customSizeGuide', urls[0]);
            }
        } catch (err) {
            alert("Lỗi tải ảnh");
        } finally {
            setUploadingSize(false);
            e.target.value = '';
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Chất vải (Material)</label>
                             <input 
                                type="text" 
                                value={product.material || ''}
                                onChange={(e) => handleChange('material', e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Ví dụ: Vải dệt thoi"
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Dòng sản phẩm (Gender)</label>
                             <select 
                                value={product.gender || 'FEMALE'}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="FEMALE">FEMALE (Nữ)</option>
                                <option value="MALE">MALE (Nam)</option>
                                <option value="UNISEX">UNISEX</option>
                            </select>
                        </div>
                    </div>

                    {/* Colors Manager */}
                    <div className="space-y-2 bg-gray-50 p-4 rounded border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700">Màu sắc</label>
                        
                        {/* List Existing Colors */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {product.colors && product.colors.length > 0 ? (
                                product.colors.map((color, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border shadow-sm">
                                        <div 
                                            className="w-5 h-5 rounded-full border border-gray-300" 
                                            style={{ backgroundColor: color.hex }}
                                        ></div>
                                        <span className="text-sm">{color.name}</span>
                                        <button 
                                            onClick={() => handleRemoveColor(idx)}
                                            className="text-gray-400 hover:text-red-600 ml-2"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <span className="text-sm text-gray-400 italic">Chưa có màu sắc nào</span>
                            )}
                        </div>

                        {/* Add New Color */}
                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Tên màu (VD: Đỏ Đô)</label>
                                <input 
                                    type="text" 
                                    value={tempColorName}
                                    onChange={(e) => setTempColorName(e.target.value)}
                                    className="w-full border border-gray-300 rounded p-1.5 text-sm"
                                    placeholder="Nhập tên màu..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Chọn màu</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={tempColorHex}
                                        onChange={(e) => setTempColorHex(e.target.value)}
                                        className="h-9 w-12 p-0 border border-gray-300 rounded cursor-pointer"
                                    />
                                    <input 
                                        type="text"
                                        value={tempColorHex}
                                        onChange={(e) => setTempColorHex(e.target.value)}
                                        className="w-20 border border-gray-300 rounded p-1.5 text-sm font-mono"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleAddColor}
                                type="button"
                                className="bg-gray-800 text-white px-3 py-2 rounded text-sm hover:bg-black h-9"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Thông tin chi tiết (Hiển thị trong tab "Thông tin sản phẩm")</label>
                        <textarea 
                            value={product.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 h-24"
                            placeholder="Ví dụ: Thổi hồn vào những thiết kế MAVO..."
                        ></textarea>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Đặc điểm nổi bật (Hiển thị ở mục mở rộng)</label>
                        <textarea 
                            value={product.highlights || ''}
                            onChange={(e) => handleChange('highlights', e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 h-24"
                            placeholder="Ví dụ: Chất liệu cao cấp, thiết kế hiện đại..."
                        ></textarea>
                    </div>
                    
                    {/* Image Gallery Component */}
                    <ProductImageGallery 
                        images={product.images} 
                        onImagesChange={(imgs) => handleChange('images', imgs)}
                        uploading={uploading}
                        setUploading={setUploading}
                    />

                    {/* Custom Size Guide */}
                    <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Bảng Size Riêng (Tùy chọn)</h4>
                        <p className="text-xs text-gray-500 mb-3">Nếu không tải lên, hệ thống sẽ sử dụng Bảng size chung trong Cấu hình.</p>
                        
                        <div className="flex items-start gap-4">
                            {product.customSizeGuide ? (
                                <div className="relative group w-24 h-24 border bg-white rounded overflow-hidden">
                                    <img src={product.customSizeGuide} alt="Custom Size" className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => handleChange('customSizeGuide', null)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ) : null}

                            <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded shadow-sm hover:bg-gray-100">
                                {uploadingSize ? <Spinner /> : <UploadIcon />}
                                <span className="text-sm">{product.customSizeGuide ? 'Thay ảnh khác' : 'Tải ảnh lên'}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleCustomSizeUpload} disabled={uploadingSize} />
                            </label>
                        </div>
                    </div>
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
                                    {categories.length > 0 ? (
                                        categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))
                                    ) : (
                                        <option value="Quần áo">Quần áo (Mặc định)</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={saving || uploading || uploadingSize}
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
