import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000); // Auto dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 shadow-red-100';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} className="text-emerald-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-500 animate-slide-in-right min-w-[300px] max-w-md backdrop-blur-sm ${getStyles()}`}>
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
      <button 
        onClick={() => onClose(toast.id)} 
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {/* Enable pointer events only on the toasts themselves */}
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};
