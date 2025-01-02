import React, { useEffect, useState } from "react";
import Modal from "../utils/Modal";
import Barcode from "react-barcode";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { FaPrint } from "react-icons/fa";

const ProductBarcode = ({ product, setRefetch = () => {} }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [barcodeInfo, setBarcodeInfo] = useState(product?.barcodeInfo || "");

  const labelRef = React.useRef(null);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/${product._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ barcodeInfo }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setModalOpen(false);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handlePrint = () => {
    if (labelRef.current) {
      const printContents = labelRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Barcode Label</title>
            <style>
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  font-family: 'Outfit', sans-serif;
                  height: 100vh;
                }
                h2{
                  font-size: 2rem;
                  margin: 20px 0;
                  padding: 0;
                }
                .label, body div {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                }
                .no-print, body button {
                  display: none !important;
                }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="bg-[var(--color-card)] p-4 rounded-lg shadow-md text-[var(--color-text)] flex items-center justify-center relative">
      <div
        ref={labelRef}
        className="label flex flex-col items-center relative bg-white w-fit text-black"
      >
        <h2 className="text-xl max-sm:text-lg font-semibold mt-2 text-black">
          {product?.name}
        </h2>
        <p>({product.category})</p>
        {/* Barcode Preview */}
        <div className="px-4">
          {product.upc || product.upid ? (
            <Barcode value={product.upc || product.upid} />
          ) : (
            <span className="text-sm text-red-500">No barcode available</span>
          )}
        </div>

        {/* Additional Barcode Info */}
        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
          <p>{product.barcodeInfo || "No additional barcode info"}</p>
          {/* Edit Button */}
          <button
            className="text-black rounded-md hover:text-accent/80 transition-all duration-300"
            onClick={() => setModalOpen(true)}
          >
            <MdEdit />
          </button>
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="text-accent px-4 py-2 rounded hover:text-accentDark no-print absolute top-4 right-4 cursor-pointer"
      >
        <FaPrint />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          isOpen={isModalOpen}
          title={"Edit Barcode"}
        >
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
