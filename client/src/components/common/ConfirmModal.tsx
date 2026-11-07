import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message = 'This action cannot be undone.',
  confirmLabel,
  confirmText,
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  const actionButtonText = confirmText || confirmLabel || 'Delete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-border-color relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-2 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isDestructive
                ? 'bg-accent-error/10 text-accent-error'
                : 'bg-brand-primary/10 text-brand-primary'
              }`}
          >
            {isDestructive ? <AlertTriangle className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary leading-tight">
              {title}
            </h3>
            {message && <p className="text-xs text-text-muted mt-0.5">{message}</p>}
          </div>
        </div>

        <div className="pt-4 border-t border-border-color flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-border-color text-text-muted hover:text-text-primary text-xs font-semibold hover:bg-surface-2 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 ${isDestructive
                ? 'bg-accent-error hover:bg-red-700'
                : 'bg-brand-primary hover:bg-brand-hover'
              }`}
          >
            {isLoading ? 'Processing...' : actionButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
