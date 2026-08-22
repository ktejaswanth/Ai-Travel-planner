import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/40',
    error: 'border-rose-500/30 bg-rose-950/40',
    info: 'border-sky-500/30 bg-sky-950/40',
  };

  return (
    <div className={`flex items-start p-4 rounded-xl border glass-panel shadow-2xl space-x-3 w-80 sm:w-96 ${borders[toast.type]} transition-all duration-300`}>
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-100">{toast.title}</h4>
        {toast.message && <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-slate-200 p-0.5 rounded-lg transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
