'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  error?: string | null;
}

export default function Modal({
  title,
  description,
  onClose,
  children,

  showFooter = true,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  isDisabled = false,
  onConfirm,
  onCancel,

  error = null,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>

        {/* Description */}
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

        {/* Content */}
        <div>{children}</div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 mt-3 mb-0">
            {error}
          </p>
        )}

        {showFooter && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel || onClose}
              disabled={isLoading}
              className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isDisabled || isLoading}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? `${confirmText}...` : confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
