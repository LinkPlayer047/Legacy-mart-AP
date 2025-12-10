"use client";

export default function ModalWrapper({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
