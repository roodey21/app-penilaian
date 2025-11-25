import React from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            {title && <h3 className="text-lg font-bold">{title}</h3>}
          </div>
          <button onClick={onClose} className="px-3 py-1 text-gray-600 rounded hover:bg-gray-100">✕</button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="px-6 py-4 border-t flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
