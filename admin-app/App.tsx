import React, { useState, useEffect } from 'react';

// Icons
const ChartBarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ShoppingBagIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const UserGroupIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const UploadIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

// CONFIGURATION
const PROD_API_URL = 'https://mavo-fashion-api.mavo-web.workers.dev'; 

// Force using Production API even on localhost
const API_BASE = PROD_API_URL;
const API_URL = `${API_BASE}/api/products`;
const UPLOAD_URL = `${API_BASE}/api/uploads/presign`;

// --- IMAGE COMPRESSION LOGIC ---
const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = (e) => reject(e);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            // 1. Resize Logic (Max 1600px)
            const MAX_DIMENSION = 1600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                }
            } else {
                if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw image on canvas with high quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // 2. Compression Logic
            // Goal: Highest Quality possible as long as it is under 0.6MB
            const MAX_SIZE_BYTES = 0.6 * 1024 * 1024; // 0.6 MB
            const MIN_QUALITY = 0.1; // Safety floor
            let currentQuality = 1.0; // Start at MAX Quality (100%)

            const attemptCompression = (q: number) => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Compression failed'));
                            return;
                        }

                        // Logic:
                        // If Blob size <= Limit OR we hit Minimum Quality -> Resolve.
                        // If Blob size > Limit -> Decrease quality and retry.
                        
                        if (blob.size <= MAX_SIZE_BYTES || q <= MIN_QUALITY) {
                            // Create new file with .webp extension
                            const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                            const newFile = new File([blob], newName, {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            });
                            console.log(`Compressed: ${(file.size/1024/1024).toFixed(2)}MB -> ${(newFile.size/1024).toFixed(2)}KB (Q: ${q.toFixed(2)})`);
                            resolve(newFile);
                        } else {
                            // Retry with lower quality (fine steps for better control)
                            // If > 0.6MB, reduce by 0.05
                            attemptCompression(q - 0.05); 
                        }
                    },
                    'image/webp',
                    q
                );
            };

            attemptCompression(currentQuality);
        };

        reader.readAsDataURL(file);
    });
};

const AdminApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch products on load
  useEffect(() => {
    if (activeTab === 'products') {
        fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
      setLoading(true);
      try {
          // Fix Caching: Use timestamp query param only.
          const res = await fetch(`${API_URL}?_t=${Date.now()}`);
          const data = await res.json();
          
          // Handle both legacy (Array) and new (Object with items) API response formats
          const items = Array.isArray(data) ? data : (data.items || []);

          // Flatten the nested structure for Admin Table
          const flattenedData = items.map((item: any) => ({
             ...item,
             price: item.pricing?.price ?? item.price ?? 0,
             originalPrice: item.pricing?.compareAtPrice ?? item.originalPrice
          }));
          setProducts(flattenedData);
      } catch (err) {
          console.error("Failed to fetch products", err);
          alert(`Lỗi kết nối tới: ${API_URL}\nKiểm tra lại đường truyền internet hoặc URL API.`);
      } finally {
          setLoading(false);
      }
  };

  const handleEditClick = (product: any) => {
      // Clone to avoid direct mutation
      setEditingProduct({ 
          ...product,
          images: product.images || (product.image ? [product.image] : [])
      });
  };

  const handleCreateClick = () => {
      setEditingProduct({
          id: '', // Indicates new product
          name: '',
          description: '',
          price: 0,
          originalPrice: 0,
          sku: '',
          images: [],
          colors: [],
          category: 'Quần áo'
      });
      setActiveTab('products');
  };

  const handleInputChange = (field: string, value: any) => {
      setEditingProduct((prev: any) => ({
          ...prev,
          [field]: value
      }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0 || !editingProduct) return;
      
      const originalFile = e.target.files[0];
      setUploading(true);

      try {
          // 0. Compress Image
          const compressedFile = await compressImage(originalFile);

          // 1. Get Presigned URL
          const presignRes = await fetch(UPLOAD_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  filename: compressedFile.name,
                  contentType: compressedFile.type
              })
          });

          if (!presignRes.ok) throw new Error("Failed to get presigned URL");
          const { uploadUrl, publicUrl } = await presignRes.json();

          // 2. Upload to R2 directly (Client-side upload)
          const uploadRes = await fetch(uploadUrl, {
              method: 'PUT',
              headers: { 
                  'Content-Type': compressedFile.type 
                  // No Authorization header here, as it's included in the signed URL query params
              },
              body: compressedFile
          });

          if (!uploadRes.ok) throw new Error("Failed to upload file to R2");

          // 3. Update State with the public URL
          setEditingProduct((prev: any) => ({
              ...prev,
              images: [...(prev.images || []), publicUrl]
          }));
          
          alert("Tải và nén ảnh thành công!");
      } catch (err) {
          console.error("Upload error", err);
          alert("Lỗi tải ảnh! Kiểm tra console.");
      } finally {
          setUploading(false);
          // Reset input
          e.target.value = '';
      }
  };

  const removeImage = (indexToRemove: number) => {
      if (!editingProduct) return;
      setEditingProduct((prev: any) => ({
          ...prev,
          images: prev.images.filter((_: any, idx: number) => idx !== indexToRemove)
      }));
  }

  const handleSave = async () => {
      if (!editingProduct) return;
      setSaving(true);
      
      const isNew = !editingProduct.id;
      const url = isNew ? API_URL : `${API_URL}/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      try {
          const res = await fetch(url, {
              method: method,
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(editingProduct)
          });
          
          if (!res.ok) throw new Error("Failed to save");
          
          const savedProduct = await res.json();
          
          alert(isNew ? "Tạo mới thành công!" : "Cập nhật thành công!");
          
          // Update local state
          if (isNew) {
              setProducts(prev => [savedProduct, ...prev]);
          } else {
              setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
          }

          setEditingProduct(null);
          
      } catch (err) {
          console.error(err);
          alert("Lưu thất bại. Vui lòng kiểm tra console.");
      } finally {
          setSaving(false);
      }
  };

  const getTabTitle = () => {
      switch(activeTab) {
          case 'dashboard': return 'Tổng quan';
          case 'products': return 'Sản phẩm';
          case 'orders': return 'Đơn hàng';
          default: return '';
      }
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-wider">MAVO CMS</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <ChartBarIcon /> Tổng quan
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'products' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <ShoppingBagIcon /> Sản phẩm
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'orders' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <UserGroupIcon /> Đơn hàng
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-500"></div>
                <div>
                    <p className="text-sm font-medium">Quản trị viên</p>
                    <p className="text-xs text-gray-400">admin@mavo.vn</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{getTabTitle()}</h2>
            <button 
                onClick={handleCreateClick}
                className="bg-black text-white px-4 py-2 text-sm font-bold uppercase rounded hover:bg-gray-800"
            >
                + Thêm mới
            </button>
        </header>

        <div className="p-8">
          {activeTab === 'products' && (
             <div className="bg-white rounded-lg shadow border border-gray-200 min-h-[400px]">
                {editingProduct ? (
                    // Edit/Create Form
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-lg font-bold">
                                {editingProduct.id ? `Chỉnh sửa: ${editingProduct.name}` : 'Tạo sản phẩm mới'}
                            </h3>
                            <button onClick={() => setEditingProduct(null)} className="text-sm text-gray-500 hover:text-black underline">Hủy bỏ</button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Col: General Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                                    <input 
                                        type="text" 
                                        value={editingProduct.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2" 
                                        placeholder="Nhập tên sản phẩm..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                    <textarea 
                                        value={editingProduct.description || ''}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 h-32"
                                        placeholder="Mô tả chi tiết sản phẩm..."
                                    ></textarea>
                                </div>
                                
                                {/* Image Management */}
                                <div className="space-y-4 bg-gray-50 p-4 border rounded-md">
                                    <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                                    
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        {editingProduct.images && editingProduct.images.map((img: string, idx: number) => (
                                            <div key={idx} className="relative group aspect-[3/4] bg-gray-200">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        ))}
                                        {(!editingProduct.images || editingProduct.images.length === 0) && (
                                            <div className="col-span-4 text-center text-sm text-gray-400 py-4 border-2 border-dashed border-gray-300 rounded">
                                                Chưa có hình ảnh nào. Tải ảnh lên ngay.
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className={`cursor-pointer flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {uploading ? <Spinner /> : <UploadIcon />}
                                            <span className="text-sm font-medium text-gray-700">{uploading ? 'Đang nén & tải lên...' : 'Tải ảnh lên'}</span>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                        <span className="text-xs text-gray-500">Hỗ trợ JPG, PNG (Max 5MB). Tự động nén sang WebP.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Pricing & Meta */}
                            <div className="space-y-6">
                                <div className="bg-white border p-4 rounded-md shadow-sm">
                                    <h4 className="font-bold text-sm mb-4">Giá bán (VND)</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-500">Giá niêm yết</label>
                                            <input 
                                                type="number" 
                                                value={editingProduct.price}
                                                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                                                className="w-full border rounded p-2" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Giá gốc (Gạch)</label>
                                            <input 
                                                type="number" 
                                                value={editingProduct.originalPrice || ''}
                                                onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))}
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
                                                value={editingProduct.sku}
                                                onChange={(e) => handleInputChange('sku', e.target.value)}
                                                className="w-full border rounded p-2" 
                                                placeholder="SKU-..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Danh mục</label>
                                            <select 
                                                value={editingProduct.category || 'Quần áo'}
                                                onChange={(e) => handleInputChange('category', e.target.value)}
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
                ) : loading ? (
                    <div className="flex items-center justify-center h-64 text-gray-500 gap-2">
                        <Spinner /> Đang tải dữ liệu...
                    </div>
                ) : (
                    // Product List mapped from API Data
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Tên sản phẩm</th>
                                <th className="px-6 py-4">Mã SKU</th>
                                <th className="px-6 py-4">Giá</th>
                                <th className="px-6 py-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Không có sản phẩm nào. Nhấn "+ Thêm mới" để tạo.</td>
                                </tr>
                            )}
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                            {product.thumbnailUrl ? (
                                                <img src={product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">N/A</div>
                                            )}
                                        </div>
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                                    <td className="px-6 py-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleEditClick(product)}
                                            className="text-gray-400 hover:text-blue-600"
                                        >
                                            <PencilIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
             </div>
          )}

          {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-gray-500 text-sm font-medium uppercase">Tổng doanh thu</h3>
                      <p className="text-3xl font-bold mt-2">12,500,000₫</p>
                      <span className="text-green-500 text-sm font-medium mt-1 inline-block">+12% so với tuần trước</span>
                  </div>
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminApp;