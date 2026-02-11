
import React, { useState, useEffect } from 'react';
import { fetchSettingsApi, saveSettingsApi, uploadImagesApi } from '../services/api';
import { AppSettings } from '../types';
import { Spinner, UploadIcon } from '../components/ui/Icons';

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<AppSettings>({
        hotline: '',
        email: '',
        zalo: '',
        sizeGuideDefault: '',
        careGuideDefault: '',
        returnPolicyDefault: '',
        googleSheetWebhookUrl: '',
        facebook: '',
        instagram: '',
        youtube: '',
        tiktok: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingSize, setUploadingSize] = useState(false);
    const [uploadingCare, setUploadingCare] = useState(false);
    const [uploadingReturn, setUploadingReturn] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await fetchSettingsApi();
                setSettings(prev => ({ ...prev, ...data }));
            } catch (err) {
                console.error("Failed to load settings (Normal if first time/no DB table):", err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleChange = (key: keyof AppSettings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveSettingsApi(settings);
            alert("Đã lưu cấu hình thành công!");
        } catch (err: any) {
            console.error(err);
            alert(`Lỗi khi lưu cấu hình: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>, 
        key: 'sizeGuideDefault' | 'careGuideDefault' | 'returnPolicyDefault', 
        setLoadingState: (s: boolean) => void
    ) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setLoadingState(true);
        try {
            const files = Array.from(e.target.files) as File[];
            const urls = await uploadImagesApi(files);
            if (urls.length > 0) {
                handleChange(key, urls[0]);
            }
        } catch (err) {
            alert("Lỗi tải ảnh");
        } finally {
            setLoadingState(false);
            e.target.value = '';
        }
    };

    if (loading) return <div className="text-center py-10">Đang tải...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Thông tin liên hệ</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hotline</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2"
                            value={settings.hotline}
                            onChange={(e) => handleChange('hotline', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email CSKH</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2"
                            value={settings.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zalo Hỗ trợ</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2"
                            value={settings.zalo}
                            onChange={(e) => handleChange('zalo', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Mạng xã hội</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            value={settings.facebook || ''}
                            onChange={(e) => handleChange('facebook', e.target.value)}
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            value={settings.instagram || ''}
                            onChange={(e) => handleChange('instagram', e.target.value)}
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            value={settings.youtube || ''}
                            onChange={(e) => handleChange('youtube', e.target.value)}
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            value={settings.tiktok || ''}
                            onChange={(e) => handleChange('tiktok', e.target.value)}
                            placeholder="https://tiktok.com/..."
                        />
                    </div>
                </div>
            </div>

            {/* Integration */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4 border-b pb-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Sheets_logo_%282014-2020%29.svg/800px-Google_Sheets_logo_%282014-2020%29.svg.png" className="w-6 h-auto" alt="Sheets" />
                    <h3 className="text-lg font-bold">Kết nối Google Sheets</h3>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Google Apps Script Webhook URL</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2 text-sm text-gray-600"
                            value={settings.googleSheetWebhookUrl || ''}
                            onChange={(e) => handleChange('googleSheetWebhookUrl', e.target.value)}
                            placeholder="https://script.google.com/macros/s/..."
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Dán URL Webhook từ Google Apps Script để tự động lưu đơn hàng mới vào file Excel online. 
                            <a href="#" className="text-blue-600 underline ml-1" onClick={(e) => { e.preventDefault(); alert('Xem file GOOGLE_SHEET_SETUP.md trong source code để biết cách tạo script.'); }}>Xem hướng dẫn</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Global Images */}
            <h3 className="text-lg font-bold mb-2">Hình ảnh hệ thống</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Size Guide */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-bold mb-4 border-b pb-2">Bảng Size Chung</h4>
                    <div className="aspect-[3/2] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                        {settings.sizeGuideDefault ? (
                            <img src={settings.sizeGuideDefault} alt="Size Guide" className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-gray-400 text-sm">Chưa có hình ảnh</span>
                        )}
                    </div>
                    <div className="mt-4">
                        <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 w-full justify-center">
                            {uploadingSize ? <Spinner /> : <UploadIcon />}
                            <span className="text-sm font-medium">{uploadingSize ? 'Đang tải...' : 'Thay đổi ảnh'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'sizeGuideDefault', setUploadingSize)} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Hiển thị khi sản phẩm không có bảng size riêng.</p>
                </div>

                {/* Care Guide */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-bold mb-4 border-b pb-2">Hướng dẫn bảo quản</h4>
                    <div className="aspect-[3/2] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                        {settings.careGuideDefault ? (
                            <img src={settings.careGuideDefault} alt="Care Guide" className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-gray-400 text-sm">Chưa có hình ảnh</span>
                        )}
                    </div>
                    <div className="mt-4">
                        <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 w-full justify-center">
                            {uploadingCare ? <Spinner /> : <UploadIcon />}
                            <span className="text-sm font-medium">{uploadingCare ? 'Đang tải...' : 'Thay đổi ảnh'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'careGuideDefault', setUploadingCare)} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Hiển thị trong tab "Hướng dẫn bảo quản".</p>
                </div>

                {/* Return Policy */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-bold mb-4 border-b pb-2">Chính sách đổi hàng</h4>
                    <div className="aspect-[3/2] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                        {settings.returnPolicyDefault ? (
                            <img src={settings.returnPolicyDefault} alt="Return Policy" className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-gray-400 text-sm">Chưa có hình ảnh</span>
                        )}
                    </div>
                    <div className="mt-4">
                        <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 w-full justify-center">
                            {uploadingReturn ? <Spinner /> : <UploadIcon />}
                            <span className="text-sm font-medium">{uploadingReturn ? 'Đang tải...' : 'Thay đổi ảnh'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'returnPolicyDefault', setUploadingReturn)} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Hiển thị trong tab "Chính sách đổi hàng".</p>
                </div>
            </div>

            <button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full bg-black text-white py-3 rounded font-bold uppercase hover:bg-gray-800 disabled:opacity-50 flex justify-center gap-2"
            >
                {saving && <Spinner />}
                {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
        </div>
    );
};

export default Settings;
