import React, { useState, useEffect } from 'react';

// Icons
const ChartBarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ShoppingBagIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const UserGroupIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// CONFIGURATION
const IS_LOCALHOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// [IMPORTANT] Thay thế dòng dưới bằng URL thật bạn nhận được sau khi chạy 'npm run deploy'
const PROD_API_URL = 'https://mavo-fashion-api.YOUR-SUBDOMAIN.workers.dev'; 

const API_BASE = IS_LOCALHOST ? 'http://localhost:8080' : PROD_API_URL;
const API_URL = `${API_BASE}/api/products`;

const AdminApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch products on load
  useEffect(() => {
    if (activeTab === 'products') {
        fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
      setLoading(true);
      try {
          // Fix Caching: Add timestamp query param AND Cache-Control headers
          // This ensures browser always requests fresh data from server
          const res = await fetch(`${API_URL}?_t=${Date.now()}`, {
              headers: { 
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache'
              }
          });
          const data = await res.json();
          setProducts(data);
      } catch (err) {
          console.error("Failed to fetch products", err);
          alert(`Lỗi kết nối Backend! \nĐang thử kết nối tới: ${API_URL}`);
      } finally {
          setLoading(false);
      }
  };

  const handleEditClick = (product: any) => {
      // Clone to avoid direct mutation
      setEditingProduct({ ...product });
  };

  const handleInputChange = (field: string, value: any) => {
      setEditingProduct((prev: any) => ({
          ...prev,
          [field]: value
      }));
  };

  const handleSave = async () => {
      if (!editingProduct) return;
      setSaving(true);
      try {
          const res = await fetch(`${API_URL}/${editingProduct.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(editingProduct)
          });
          
          if (!res.ok) throw new Error("Failed to update");
          
          // Wait for the update to complete
          await res.json();
          
          alert("Cập nhật thành công!");
          
          // 1. Close the edit form FIRST
          setEditingProduct(null);

          // 2. Re-fetch the fresh list from server to ensure UI is in sync
          await fetchProducts();
          
      } catch (err) {
          console.error(err);
          alert("Cập nhật thất bại. Vui lòng kiểm tra console.");
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
            <button className="bg-black text-white px-4 py-2 text-sm font-bold uppercase rounded hover:bg-gray-800">
                + Thêm mới
            </button>
        </header>

        <div className="p-8">
          {activeTab === 'products' && (
             <div className="bg-white rounded-lg shadow border border-gray-200 min-h-[400px]">
                {/* Logic: If editing, show form. If NOT editing but loading, show spinner. Else show table. */}
                {editingProduct ? (
                    // Edit Form
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-lg font-bold">Chỉnh sửa: {editingProduct.name}</h3>
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
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                    <textarea 
                                        value={editingProduct.description || ''}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 h-32"
                                    ></textarea>
                                </div>
                                
                                {/* Tabs Section Placeholder */}
                                <div className="border p-4 rounded-md bg-gray-50">
                                    <h4 className="font-bold text-sm mb-3 uppercase text-gray-500">Cấu hình Tabs (Thông tin)</h4>
                                    <div className="space-y-3">
                                        <input type="text" placeholder="Tiêu đề thông tin..." className="w-full border p-2 text-sm" />
                                        <input type="text" placeholder="Nội dung hướng dẫn bảo quản..." className="w-full border p-2 text-sm" />
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
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
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
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Không có sản phẩm nào.</td>
                                </tr>
                            )}
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{product.name}</td>
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