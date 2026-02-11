
import React, { useEffect, useState } from 'react';
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    InformationCircleIcon, 
    XMarkIcon 
} from '@heroicons/react/24/solid';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    // Auto dismiss logic
    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        // Progress bar logic
        const intervalTime = 10;
        const step = 100 / (duration / intervalTime);
        const progressTimer = setInterval(() => {
            setProgress((prev) => Math.max(0, prev - step));
        }, intervalTime);

        return () => {
            clearTimeout(timer);
            clearInterval(progressTimer);
        };
    }, [duration, id]);

    const handleClose = () => {
        setIsExiting(true);
        // Wait for animation to finish before actual removal
        setTimeout(() => {
            onClose(id);
        }, 300); 
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
            case 'error': return <XCircleIcon className="w-6 h-6 text-red-500" />;
            default: return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'border-green-500';
            case 'error': return 'border-red-500';
            default: return 'border-blue-500';
        }
    };

    return (
        <div 
            className={`
                relative flex items-start gap-3 w-80 md:w-96 bg-white shadow-xl rounded-lg p-4 border-l-4 ${getBorderColor()}
                transform transition-all duration-300 ease-in-out mb-3
                ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100 animate-slide-in-right'}
            `}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
            </div>
            
            <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 capitalize">
                    {type === 'success' ? 'Thành công' : type === 'error' ? 'Thất bại' : 'Thông báo'}
                </h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {message}
                </p>
            </div>

            <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gray-100 w-full rounded-b-lg overflow-hidden">
                <div 
                    className={`h-full transition-all linear ${
                        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <style>{`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Toast;
