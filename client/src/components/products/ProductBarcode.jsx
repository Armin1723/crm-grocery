import React, { useState } from "react";
import Modal from "../utils/Modal"; 
import Barcode from "react-barcode";
import { FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ProductBarcode = ({ product, onSaveBarcode }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [barcodeInfo, setBarcodeInfo] = useState(product.barcodeInfo || "");

  const handleSave = () => {
    onSaveBarcode(barcodeInfo);
    setModalOpen(false);
  };

  return (
    <div className="bg-[var(--color-card)] p-4 rounded-lg shadow-md text-[var(--color-text)] ">
      <div className="flex flex-col items-center relative">
        {/* Barcode Preview */}
        <div className="mb-4 px-4">
          {product.upc || product.upid ? (
            <Barcode value={product.upc || product.upid} />
          ) : (
            <span className="text-sm text-red-500">No barcode available</span>
          )}
        </div>

        {/* Additional Barcode Info */}
        <p className="text-sm text-[var(--color-text-light)] mb-2">
          {product.barcodeInfo || "No additional barcode info"}
        </p>

        {/* Edit Button */}
        <button
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark absolute bottom-0 right-4"
          onClick={() => setModalOpen(true)}
        >
          <MdEdit />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)} isOpen={isModalOpen} title={"Edit Barcode"}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Additional Barcode Info
              </label>
              <input
                type="text"
                value={barcodeInfo}
                onChange={(e) => setBarcodeInfo(e.target.value)}
                placeholder="Enter additional barcode info"
                className="w-full px-3 py-2 rounded-md outline-none border border-neutral-500/50 bg-transparent my-2"
              />
              <button
                className="px-3 py-1 bg-accent text-white rounded-md hover:bg-accent-dark"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default ProductBarcode;
