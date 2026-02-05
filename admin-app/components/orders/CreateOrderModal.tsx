
import React, { useState } from 'react';
import { Product } from '../../types';
import { TrashIcon } from '../ui/Icons';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose, products }) => {
    const [newOrder, setNewOrder] = useState({
        customerName: '',
        customerPhone: '',
        address: '',
        items: [] as { productId: string, quantity: number, size: string }[]
    });

    const handleAddItemToNewOrder = () => {
        if (products.length > 0) {
            setNewOrder(prev => ({
                ...prev,
                items: [...prev.items, { productId: products[0].id, quantity: 1, size: 'M' }]
            }));
        }
    };

    const handleSubmitNewOrder = async () => {
        alert("Tính năng tạo đơn đang được cập nhật phía Backend API.");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Tạo đơn hàng mới</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">✕</button>
                </div>
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
                            <input type="text" className="w-full border p-2 rounded" placeholder="Nhập tên khách hàng" 
                                value={newOrder.customerName} onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                            <input type="text" className="w-full border p-2 rounded" placeholder="Số điện thoại"
                                value={newOrder.customerPhone} onChange={e => setNewOrder({...newOrder, customerPhone: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng</label>
                            <input type="text" className="w-full border p-2 rounded" placeholder="Địa chỉ chi tiết..."
                                value={newOrder.address} onChange={e => setNewOrder({...newOrder, address: e.target.value})} />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-sm">Sản phẩm</h4>
                            <button onClick={handleAddItemToNewOrder} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">+ Thêm dòng</button>
                        </div>
                        {newOrder.items.map((item, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <select 
                                    className="flex-1 border p-2 rounded text-sm"
                                    value={item.productId}
                                    onChange={e => {
                                        const newItems = [...newOrder.items];
                                        newItems[idx].productId = e.target.value;
                                        setNewOrder({...newOrder, items: newItems});
                                    }}
                                >
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <input type="number" className="w-16 border p-2 rounded text-sm" value={item.quantity} 
                                    onChange={e => {
                                        const newItems = [...newOrder.items];
                                        newItems[idx].quantity = Number(e.target.value);
                                        setNewOrder({...newOrder, items: newItems});
                                    }}
                                />
                                <button 
                                    onClick={() => setNewOrder(prev => ({...prev, items: prev.items.filter((_, i) => i !== idx)}))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                        {newOrder.items.length === 0 && <p className="text-sm text-gray-400 italic">Chưa có sản phẩm nào được chọn.</p>}
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border rounded text-sm font-medium">Hủy</button>
                    <button onClick={handleSubmitNewOrder} className="px-6 py-2 bg-black text-white rounded text-sm font-bold hover:bg-gray-800">Tạo đơn hàng</button>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderModal;
