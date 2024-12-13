import React from "react";
import ReactDOM from "react-dom";

const FullScreenModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-primary)] text-[var(--text-color)] w-full h-4/5 md:w-4/5 mx-4 p-6 rounded-md relative overflow-auto flex flex-col justify-center items-center"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-500/70"
        >
          ✖
        </button>
        {children}
      </div>
    </div>,
    document.body 
  );
};

export default FullScreenModal;
