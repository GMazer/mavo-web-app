
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType, ToastProps } from '../components/ui/Toast';

interface ToastContextType {
    addToast: (message: string, type: ToastType, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration, onClose: removeToast }]);
    }, [removeToast]);

    const success = useCallback((message: string, duration?: number) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message: string, duration?: number) => addToast(message, 'error', duration), [addToast]);
    const info = useCallback((message: string, duration?: number) => addToast(message, 'info', duration), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, success, error, info }}>
            {children}
            
            {/* Toast Container */}
            <div className="fixed top-24 right-4 z-[9999] flex flex-col items-end pointer-events-none">
                {/* Pointer events auto applied to children by default, but container should let clicks pass through */}
                <div className="pointer-events-auto">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
