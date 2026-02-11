
import React from 'react';
import { Spinner } from './Icons';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'info' | 'warning';
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = "Xác nhận",
    cancelLabel = "Hủy bỏ",
    type = 'danger',
    isLoading = false,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    const getColors = () => {
        switch (type) {
            case 'danger': return { btn: 'bg-red-600 hover:bg-red-700', icon: 'text-red-600 bg-red-100' };
            case 'warning': return { btn: 'bg-orange-500 hover:bg-orange-600', icon: 'text-orange-600 bg-orange-100' };
            default: return { btn: 'bg-blue-600 hover:bg-blue-700', icon: 'text-blue-600 bg-blue-100' };
        }
    };

    const colors = getColors();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden scale-100 transform transition-all">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colors.icon}`}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                    <button
                        type="button"
                        className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 text-white text-sm font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 transition-colors flex items-center gap-2 ${colors.btn}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && <Spinner />}
                        {isLoading ? 'Đang xử lý...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
