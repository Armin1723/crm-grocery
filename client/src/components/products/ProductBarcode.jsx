import React, { useState } from "react";
import Modal from "../utils/Modal";
import Barcode from "react-barcode";
import { MdEdit } from "react-icons/md";
import { FaPrint } from "react-icons/fa";

const ProductBarcode = ({ product, setRefetch = () => {} }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [barcodeInfo, setBarcodeInfo] = useState(product?.barcodeInfo);

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
            <title>Barcode - ${product?.upid}</title>
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
                  padding: 0;
                  margin: 0;
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
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 className="text-xl max-sm:text-lg font-semibold mt-2 text-black">
          Store Name
        </h2>
        <p className="flex items-center gap-1">
          <span className="">{product?.name}</span>
          <span className="text-xs italic"> ({product.category})</span>
        </p>
        {/* Barcode Preview */}
        <div className="px-4">
          {product.upc || product.upid ? (
            <Barcode value={product.upc || product.upid} />
          ) : (
            <span className="text-sm text-red-500">No barcode available</span>
          )}
        </div>

        {/* Additional Barcode Info */}
        <div
          className="text-sm text-gray-500 mb-2 flex items-center gap-2"
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {product?.barcodeInfo ? (
            <p>{product.barcodeInfo}</p>
          ) : (
            <button>No additional barcode info</button>
          )}

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
              value={barcodeInfo || product?.barcodeInfo}
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
