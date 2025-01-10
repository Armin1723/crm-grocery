import React, { useState, useRef } from "react";
import Barcode from "react-barcode";
import { FaPrint, FaDownload } from "react-icons/fa";
import Modal from "../utils/Modal";
import { MdEdit } from "react-icons/md";
import { toPng } from "html-to-image";

const BatchLabel = ({
  inventory = {},
  batch = {},
  closeModal = () => {},
  setRefetch = () => {},
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [barcodeInfo, setBarcodeInfo] = useState(inventory?.barcodeInfo);

  const labelRefInventory = useRef(null);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/${
          inventory?.product
        }`,
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
      closeModal();
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = () => {
    if (labelRefInventory.current) {
      let printContents = labelRefInventory.current.innerHTML;
      const printWindow = window.open("", "_blank");

      const tailwindCSSStyles = document.querySelector(
        'link[rel="stylesheet"]'
      )?.href;

      // Get the compiled Tailwind CSS styles (from a built file)
      const tailwindCSS =
        document.querySelector("style[data-vite-dev-id]")?.innerHTML || "";

      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Barcode</title>
             <link rel="stylesheet" href="${tailwindCSSStyles}" />
            <style>
            ${tailwindCSS}
              body {
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: 'Outfit', sans-serif;
                height: 100vh;
                gap: 0;
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

  const handleDownload = async () => {
    if (labelRefInventory.current) {
      const noPrint = document.querySelectorAll(".no-print");
      noPrint.forEach((el) => (el.style.display = "none"));
      try {
        const dataUrl = await toPng(labelRefInventory.current);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `barcode_${inventory?.upid || "label"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        noPrint.forEach((el) => (el.style.display = "block"));
      }
    }
  };

  return (
    <div className="bg-[var(--color-card)] p-4 rounded-lg shadow-md text-[var(--color-text)] flex items-center justify-center relative">
      <div
        ref={labelRefInventory}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "fit-content",
          color: "black",
          padding: "1rem",
          backgroundColor: "white",
        }}
      >
        <h2
          style={{
            fontSize: "1.4rem",
            padding: 0,
            margin: 0,
            fontWeight: "semibold",
          }}
          className="text-xl max-sm:text-lg font-semibold mt-2"
        >
          Store Name
        </h2>
        <p style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          <span className="">{inventory?.name}</span>
          <span
            style={{
              textTransform: "italic",
            }}
          >
            {" "}
            ({inventory.category})
          </span>
        </p>
        <div
          className="rates"
          style={{
            display: "flex",
            gap: "0.25rem",
            alignItems: "center",
            margin: 0,
            padding: 0,
          }}
        >
          {batch.mrp && batch.mrp > batch.sellingRate && (
            <p>
              MRP:
              <span
                style={{
                  textDecoration: "line-through",
                }}
              >
                {batch?.mrp}
              </span>
              ₹
            </p>
          )}
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            Our Price: {batch?.sellingRate}₹
          </p>
        </div>
        {/* Barcode Preview */}
        <div className="px-4">
          {inventory.upc || inventory.upid ? (
            <Barcode value={inventory.upc || inventory.upid} />
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
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {inventory?.barcodeInfo ? (
              <p>{inventory.barcodeInfo}</p>
            ) : (
              <button className="no-print">No more info</button>
            )}

            {/* Edit Button */}
            <button
              className="text-black rounded-md hover:text-accent/80 transition-all duration-300 no-print"
              onClick={() => setModalOpen(true)}
            >
              <MdEdit />
            </button>
          </div>
        </div>
      </div>

      <div className="buttons absolute top-6 right-4 flex items-center gap-2">
        {/* Print Button */}
        <button
          onClick={handlePrint}
          title="Print Barcode"
          className="py-2 text-accent hover:text-accentDark text-sm no-print cursor-pointer"
        >
          <FaPrint />
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          title="Print Barcode"
          className="py-2 text-accent hover:text-accentDark text-sm no-print cursor-pointer"
        >
          <FaDownload />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          isOpen={isModalOpen}
          title={"Edit Barcode"}
        >
          <div className="mb-4 font-normal">
            <label className="block text-sm font-normal mb-2">
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

export default BatchLabel;
