import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-screen p-8 overflow-y-auto bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {children}
        </div>
        {footer && (
          <div className="flex items-center mt-8 space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
