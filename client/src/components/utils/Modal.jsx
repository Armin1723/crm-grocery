import React from 'react'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="bg-[var(--color-sidebar)] rounded-md p-6 w-1/2 max-sm:w-[90%] overflow-hidden max-h-[90vh] max-sm:px-6">
        <div className="flex items-center gap-2 w-full justify-between my-4">
          <h2 className="text-lg font-bold ">{title}</h2>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[60vh]">{children}</div>
      </div>
    </div>
  );
};

export default Modal
