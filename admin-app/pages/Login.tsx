
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Icons';
import { useToast } from '../../context/ToastContext';

const API_BASE = 'https://mavo-fashion-api.mavo-web.workers.dev/api';

const Login: React.FC = () => {
    const { login } = useAuth();
    const toast = useToast();
    
    // Modes: 'loading', 'setup', 'login', '2fa'
    const [mode, setMode] = useState<'loading' | 'setup' | 'login' | '2fa'>('loading');
    
    // Form Data
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Setup Data
    const [qrUrl, setQrUrl] = useState('');
    const [secret, setSecret] = useState('');

    useEffect(() => {
        checkInit();
    }, []);

    const checkInit = async () => {
        try {
            const res = await fetch(`${API_BASE}/auth/check-init`);
            
            if (res.status === 404) {
                toast.error("API Backend chưa được cập nhật (404). Vui lòng Deploy lại Backend.");
                setLoading(false);
                return;
            }

            if (!res.ok) {
                toast.error(`Lỗi Server: ${res.status}`);
                return;
            }

            const data = await res.json();
            
            if (data.error) {
                console.error(data.error);
                // If DB table missing, force setup mode visually but warn user
                if (data.error.includes("Admins table")) {
                    toast.error("Chưa tạo bảng Database (Admins). Vui lòng chạy lệnh migration.");
                }
            }

            if (!data.initialized) {
                setMode('setup');
            } else {
                setMode('login');
            }
        } catch (e) {
            console.error(e);
            toast.error("Không thể kết nối đến server. Kiểm tra mạng hoặc Backend.");
        }
    };

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                setQrUrl(data.otpauth_url);
                setSecret(data.secret);
            } else {
                toast.error(data.error || "Lỗi đăng ký");
            }
        } catch (e) {
            toast.error("Lỗi đăng ký");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok && data.require2fa) {
                setMode('2fa');
            } else {
                toast.error(data.error || "Đăng nhập thất bại");
            }
        } catch (e) {
            toast.error("Lỗi đăng nhập");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginStep2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/verify-2fa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, code: twoFactorCode })
            });
            const data = await res.json();
            
            if (res.ok) {
                login(data.token, data.username);
                toast.success("Đăng nhập thành công!");
            } else {
                toast.error(data.error || "Mã xác thực không đúng");
            }
        } catch (e) {
            toast.error("Lỗi xác thực");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSetup = () => {
        setMode('login');
        setQrUrl('');
        setSecret('');
        setUsername('');
        setPassword('');
        toast.info("Vui lòng đăng nhập lại với mã 2FA.");
    };

    if (mode === 'loading') return <div className="h-screen flex items-center justify-center flex-col gap-4"><Spinner /><p className="text-gray-500 text-sm">Đang kết nối API...</p></div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-3xl font-black">M</div>
                </div>
                
                <h2 className="text-2xl font-bold text-center mb-2">MAVO ADMIN</h2>
                <p className="text-center text-gray-500 mb-8 text-sm">Hệ thống quản trị Mavo Fashion</p>

                {mode === 'login' && (
                    <form onSubmit={handleLoginStep1} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" 
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <input 
                                type="password" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex justify-center">
                            {loading ? <Spinner /> : 'ĐĂNG NHẬP'}
                        </button>
                    </form>
                )}

                {mode === '2fa' && (
                    <form onSubmit={handleLoginStep2} className="space-y-4 animate-fade-in">
                        <div className="text-center mb-4">
                            <p className="text-sm font-medium">Xin chào, {username}</p>
                            <p className="text-xs text-gray-500">Vui lòng nhập mã từ ứng dụng Authenticator</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Mã xác thực 2FA (6 số)</label>
                            <input 
                                type="text" 
                                maxLength={6}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none text-center text-2xl tracking-widest font-mono"
                                value={twoFactorCode}
                                onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g,''))}
                                autoFocus
                                required
                            />
                        </div>
                        <button disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex justify-center">
                            {loading ? <Spinner /> : 'XÁC THỰC'}
                        </button>
                        <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-gray-500 hover:text-black mt-2">
                            Quay lại đăng nhập
                        </button>
                    </form>
                )}

                {mode === 'setup' && !qrUrl && (
                    <form onSubmit={handleSetup} className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded text-sm text-blue-700 mb-4 border border-blue-100">
                            <strong>Hệ thống chưa có Admin.</strong><br/>
                            Vui lòng tạo tài khoản quản trị viên đầu tiên.
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tạo Username</label>
                            <input type="text" className="w-full border border-gray-300 p-3 rounded-lg" value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tạo Password</label>
                            <input type="password" className="w-full border border-gray-300 p-3 rounded-lg" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-bold flex justify-center">
                            {loading ? <Spinner /> : 'TẠO TÀI KHOẢN'}
                        </button>
                    </form>
                )}

                {mode === 'setup' && qrUrl && (
                    <div className="space-y-6 text-center animate-fade-in">
                        <h3 className="font-bold text-lg">Thiết lập 2FA</h3>
                        <p className="text-sm text-gray-600">Quét mã QR này bằng Google Authenticator hoặc Authy:</p>
                        
                        <div className="flex justify-center p-2 bg-white border border-gray-200 rounded-lg">
                            <img 
                                src={`https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(qrUrl)}`} 
                                alt="QR Code" 
                            />
                        </div>
                        
                        <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                            Secret: {secret}
                        </div>

                        <button onClick={handleConfirmSetup} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
                            ĐÃ QUÉT XONG, ĐI ĐẾN ĐĂNG NHẬP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
