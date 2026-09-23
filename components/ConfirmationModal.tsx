
import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isProcessing?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-[8px] p-4 animate-fade-in">
      <div className="bg-white/70 backdrop-blur-[40px] rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] max-w-sm w-full p-10 border border-white/60 flex flex-col gap-6 ring-1 ring-black/5 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-5 bg-rose-50/50 text-rose-600 rounded-[24px] border border-rose-100 shadow-sm relative group">
             <div className="absolute inset-0 bg-rose-500/10 rounded-[24px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <AlertTriangle size={32} strokeWidth={2.5} className="relative z-10" />
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 font-serif tracking-tight mb-3">{title}</h3>
          
          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-2">
            {message}
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/60">This action is irreversible</p>
        </div>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            variant="danger" 
            onClick={onConfirm} 
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Processing...</span>
            ) : (
              confirmLabel
            )}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-gray-100" 
            disabled={isProcessing}
          >
            Keep Inventory
          </Button>
        </div>
      </div>
    </div>
  );
};
