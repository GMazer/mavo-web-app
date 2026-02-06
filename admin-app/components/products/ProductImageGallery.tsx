import React, { useState } from 'react';
import { TrashIcon, UploadIcon, Spinner } from '../ui/Icons';
import { reorderList } from '../../utils/helpers';
import { uploadImagesApi } from '../../services/api';

interface ProductImageGalleryProps {
    images: string[];
    onImagesChange: (newImages: string[]) => void;
    uploading: boolean;
    setUploading: (state: boolean) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
    images, 
    onImagesChange,
    uploading,
    setUploading
}) => {
    // Local DnD State
    const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Derived State for Preview
    const activeImages = (dragFromIndex !== null && dragOverIndex !== null)
        ? reorderList(images, dragFromIndex, dragOverIndex)
        : images;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        setDragFromIndex(idx);
        setDragOverIndex(idx);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.preventDefault();
        if (dragFromIndex !== null && dragOverIndex !== idx) {
            setDragOverIndex(idx);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary for drop
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (dragFromIndex !== null && dragOverIndex !== null) {
            const finalImages = reorderList(images, dragFromIndex, dragOverIndex);
            onImagesChange(finalImages);
        }
        resetDrag();
    };

    const handleDragEnd = () => {
        resetDrag();
    };

    const resetDrag = () => {
        setDragFromIndex(null);
        setDragOverIndex(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploading(true);
        try {
            const files = Array.from(e.target.files) as File[];
            const uploadedUrls = await uploadImagesApi(files);
            onImagesChange([...images, ...uploadedUrls]);
        } catch (err) {
            console.error("Upload error", err);
            alert("Lỗi tải ảnh! Kiểm tra console.");
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        onImagesChange(images.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="space-y-4 bg-gray-50 p-4 border rounded-md">
            <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                <span className="text-xs text-gray-400">Kéo thả để sắp xếp thứ tự</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
                {activeImages.map((img: string, idx: number) => {
                    const isDraggingThis = dragOverIndex === idx;
                    return (
                        <div 
                            key={idx}
                            className={`relative group aspect-[3/4] bg-gray-200 cursor-move border-2 transition-all duration-200 ease-in-out
                                ${isDraggingThis ? 'opacity-50 border-blue-500 scale-95' : 'border-transparent hover:border-blue-400'}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragEnter={(e) => handleDragEnter(e, idx)}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover pointer-events-none" />
                            
                            {/* Badges */}
                            {idx === 0 && (
                                <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] px-2 py-1 font-bold shadow-sm z-10 pointer-events-none">
                                    Đại diện
                                </div>
                            )}
                            {idx === 1 && (
                                <div className="absolute top-0 left-0 bg-gray-800 text-white text-[10px] px-2 py-1 font-bold shadow-sm z-10 pointer-events-none">
                                    Ảnh phụ (Hover)
                                </div>
                            )}

                            <button 
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                                title="Xóa ảnh"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <TrashIcon />
                            </button>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors"></div>
                        </div>
                    );
                })}
                {activeImages.length === 0 && (
                    <div className="col-span-4 text-center text-sm text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-2">
                        <p>Chưa có hình ảnh nào.</p>
                        <p className="text-xs">Ảnh đầu tiên sẽ là ảnh đại diện.</p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <label className={`cursor-pointer flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {uploading ? <Spinner /> : <UploadIcon />}
                    <span className="text-sm font-medium text-gray-700">{uploading ? 'Đang xử lý...' : 'Tải ảnh lên'}</span>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                </label>
                <span className="text-xs text-gray-500">Hỗ trợ JPG, PNG (Max 5MB). Nén WebP. Có thể chọn nhiều ảnh.</span>
            </div>
        </div>
    );
};

export default ProductImageGallery;