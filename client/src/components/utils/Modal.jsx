import React from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <motion.div
        initial={{
          scale: 0.5,
          opacity: 0.2,
          y: -100,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.5,
          ease: "easeIn",
        }}
        className="bg-[var(--color-sidebar)] rounded-md p-6 w-[90%] lg:w-3/4 md:w-2/3 overflow-hidden min-h-[70vh] max-h-[90vh] max-sm:px-6"
      >
        <div className="flex items-center gap-2 w-full justify-between my-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            className="bg-red-500 hover:bg-red-600/90 transition-all duration-200 text-white px-3 py-1 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[60vh] flex flex-col">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
