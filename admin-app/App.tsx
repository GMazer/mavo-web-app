import React, { useState } from 'react';

// Icons
const ChartBarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ShoppingBagIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const UserGroupIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;

// Mock Data for Admin List
const MOCK_PRODUCTS = [
  { id: "1", name: "Brown Long Sleeves Woven Vest", sku: "D82510002T6CB0261", price: 999000, stock: 15, status: "Active" },
  { id: "2", name: "Brown Woven Mini Skirt", sku: "S99210002T6CB0261", price: 599000, stock: 8, status: "Active" },
  { id: "3", name: "White Mavo Embroidered Shirt", sku: "A12310002T6CB0261", price: 599500, stock: 0, status: "Out of Stock" },
];

const AdminApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

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
            <ChartBarIcon /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'products' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <ShoppingBagIcon /> Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'orders' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <UserGroupIcon /> Orders
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-500"></div>
                <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-400">admin@mavo.vn</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <button className="bg-black text-white px-4 py-2 text-sm font-bold uppercase rounded hover:bg-gray-800">
                + New Item
            </button>
        </header>

        <div className="p-8">
          {activeTab === 'products' && (
             <div className="bg-white rounded-lg shadow border border-gray-200">
                {editingProduct ? (
                    // Edit Form (Visualizing API Spec Structure)
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-lg font-bold">Edit Product: {MOCK_PRODUCTS.find(p => p.id === editingProduct)?.name}</h3>
                            <button onClick={() => setEditingProduct(null)} className="text-sm text-gray-500 hover:text-black underline">Cancel</button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Col: General Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                    <input type="text" defaultValue={MOCK_PRODUCTS.find(p => p.id === editingProduct)?.name} className="w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea className="w-full border border-gray-300 rounded-md p-2 h-32"></textarea>
                                </div>
                                
                                {/* Tabs Section from Spec */}
                                <div className="border p-4 rounded-md bg-gray-50">
                                    <h4 className="font-bold text-sm mb-3 uppercase text-gray-500">Tabs Configuration</h4>
                                    <div className="space-y-3">
                                        <input type="text" placeholder="Product Info Title" className="w-full border p-2 text-sm" />
                                        <input type="text" placeholder="Care Guide Content..." className="w-full border p-2 text-sm" />
                                        <input type="text" placeholder="Return Policy Content..." className="w-full border p-2 text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Pricing & Meta */}
                            <div className="space-y-6">
                                <div className="bg-white border p-4 rounded-md shadow-sm">
                                    <h4 className="font-bold text-sm mb-4">Pricing (VND)</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-500">Price</label>
                                            <input type="number" defaultValue={MOCK_PRODUCTS.find(p => p.id === editingProduct)?.price} className="w-full border rounded p-2" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Compare At Price</label>
                                            <input type="number" className="w-full border rounded p-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border p-4 rounded-md shadow-sm">
                                    <h4 className="font-bold text-sm mb-4">Inventory & SKU</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-500">SKU</label>
                                            <input type="text" defaultValue={MOCK_PRODUCTS.find(p => p.id === editingProduct)?.sku} className="w-full border rounded p-2" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Stock Status</label>
                                            <select className="w-full border rounded p-2">
                                                <option>In Stock</option>
                                                <option>Out of Stock</option>
                                                <option>Preorder</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">Save Changes</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Product List
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_PRODUCTS.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{product.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                                    <td className="px-6 py-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                                    <td className="px-6 py-4 text-sm">{product.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setEditingProduct(product.id)}
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
                      <h3 className="text-gray-500 text-sm font-medium uppercase">Total Sales</h3>
                      <p className="text-3xl font-bold mt-2">12,500,000₫</p>
                      <span className="text-green-500 text-sm font-medium mt-1 inline-block">+12% from last week</span>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-gray-500 text-sm font-medium uppercase">Total Orders</h3>
                      <p className="text-3xl font-bold mt-2">45</p>
                      <span className="text-green-500 text-sm font-medium mt-1 inline-block">+5% from last week</span>
                  </div>
                   <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-gray-500 text-sm font-medium uppercase">Total Products</h3>
                      <p className="text-3xl font-bold mt-2">8</p>
                      <span className="text-gray-400 text-sm font-medium mt-1 inline-block">Inventory Healthy</span>
                  </div>
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminApp;