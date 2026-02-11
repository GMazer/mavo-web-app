
import React, { useState } from 'react';
import { Product, AppSettings } from '../../types';

interface ProductTabsProps {
    product: Product;
    settings: AppSettings;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product, settings }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'care' | 'policy'>('info');

    // Determine Images
    const sizeGuideImage = product.customSizeGuide || settings.sizeGuideDefault || 'https://via.placeholder.com/800x500?text=Size+Guide+Pending';
    const careGuideImage = settings.careGuideDefault || 'https://via.placeholder.com/800x500?text=Care+Guide+Pending';
    const returnPolicyImage = settings.returnPolicyDefault || 'https://via.placeholder.com/800x500?text=Policy+Pending';

    return (
        <div className="mt-20 w-full px-6 lg:px-[260px]">
            <div className="flex flex-wrap gap-8 border-b border-gray-200 mb-8">
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`text-sm uppercase pb-3 border-b-2 transition-colors ${activeTab === 'info' ? 'border-black font-bold text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
                >
                    Thông tin sản phẩm
                </button>
                <button 
                    onClick={() => setActiveTab('care')}
                    className={`text-sm uppercase pb-3 border-b-2 transition-colors ${activeTab === 'care' ? 'border-black font-bold text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
                >
                    Hướng dẫn bảo quản
                </button>
                <button 
                    onClick={() => setActiveTab('policy')}
                    className={`text-sm uppercase pb-3 border-b-2 transition-colors ${activeTab === 'policy' ? 'border-black font-bold text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
                >
                    Chính sách đổi hàng
                </button>
            </div>

            <div className="mb-16">
                {activeTab === 'info' && (
                    <div className="animate-fade-in">
                        <h3 className="text-lg font-light uppercase mb-6">THÔNG TIN SẢN PHẨM</h3>
                        <div className="text-sm font-light text-gray-700 space-y-2 mb-10">
                            <p>Sản phẩm: {product.name}</p>
                            <p>Chất Vải: {product.material || "Vải dệt thoi"}</p>
                            <p>Dòng sản phẩm: {product.gender || "FEMALE"}</p>
                            
                            <p className="leading-relaxed whitespace-pre-line">
                                {product.description || `Thổi hồn vào những thiết kế MAVO đem đến cho bạn trải nghiệm dòng sản phẩm với phong cách trẻ trung, năng động và hiện đại. \nMAVO By DO MANH CUONG`}
                            </p>
                        </div>
                        {/* Size Guide */}
                        <div className="w-full bg-white p-4 flex justify-center border border-gray-100 rounded">
                            <img 
                                src={sizeGuideImage} 
                                alt="Bang size ao" 
                                className="max-w-full h-auto object-contain max-h-[600px]"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=Size+Guide+Not+Available';
                                }}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'care' && (
                    <div className="animate-fade-in flex justify-center py-10">
                         <img 
                            src={careGuideImage} 
                            alt="Huong dan bao quan"
                            className="max-w-[800px] w-full h-auto"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=Care+Guide+Not+Available';
                            }}
                         />
                    </div>
                )}

                {activeTab === 'policy' && (
                     <div className="animate-fade-in flex justify-center py-10">
                        <img 
                           src={returnPolicyImage} 
                           alt="Chinh sach doi hang"
                           className="max-w-[800px] w-full h-auto"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=Policy+Not+Available';
                            }}
                        />
                   </div>
                )}
            </div>
        </div>
    );
};

export default ProductTabs;
