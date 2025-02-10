import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../utils/Modal";
import { formatDateIntl } from "../utils";

const AddByBarcode = ({ getValues = [], setValue = () => {} }) => {
  const [batches, setBatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inputRef = useRef(null);

  const products = getValues("products");

  const handleProductUpdate = (product) => {
    const existingProduct = products.find(
      (p) =>
        p.batchId === product.batchId
    );

    if (existingProduct) {
      const updatedProducts = products.map((p) =>
        p.batchId === product.batchId &&
        (existingProduct.maxQuantity > p.quantity)
          ? {
              ...p,
              quantity: p.quantity + 1,
              price: p.sellingRate * (p.quantity + 1), 
            }
          : p
      );
      setValue("products", updatedProducts);
    } else {
      setValue("products", [
        ...products,
        { ...product, quantity: 1, price: product.sellingRate },
      ]);
    }
  };

  const fetchProductByBarcode = async (barcode) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/inventory/products?barcode=${barcode}`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data.products;
    } catch (error) {
      toast.error(error.message, { autoClose: 2000 });
      return null;
    }
  };

  const handleBarcodeInput = async (e) => {
    const barcode = e.target.value;
    if (barcode.length <= 9) return;

    const products = await fetchProductByBarcode(barcode);
    e.target.value = "";

    if (!products || products.length === 0) {
      toast.error("Not in stock.", { autoClose: 2000 });
      return;
    }

    if (products.length > 1) {
      setBatches(products);
      setIsModalOpen(true);
      return;
    }

    handleProductUpdate(products[0]);
  };

  useEffect(() => {
    if (!isModalOpen) {
      inputRef.current?.focus(); 
    }
  }, [isModalOpen]);

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder="Barcode"
        onChange={handleBarcodeInput}
        className="border border-neutral-500 bg-transparent px-2 py-1 rounded-md outline-none max-sm:flex-1"
      />

      {isModalOpen && (
        <Modal
          title="Select One Batch"
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        >
          <div className="flex flex-col gap-2">
            {batches.map((product) => {
              const maxQuantityAdded =
                products.find(
                  (p) =>
                    p._id === product._id &&
                    p.sellingRate === product.sellingRate &&
                    p?.expiry === product?.expiry
                )?.quantity === product.maxQuantity;
              return (
                <button
                  key={product._id}
                  disabled={maxQuantityAdded}
                  onClick={() => {
                    handleProductUpdate(product);
                    setIsModalOpen(false);
                  }}
                  title={maxQuantityAdded && "Stock empty"}
                  className={` ${
                    maxQuantityAdded && "opacity-50 cursor-not-allowed"
                  } text-left p-2 border border-neutral-500/50 rounded-md hover:bg-[var(--color-card)]`}
                >
                  <p>{product.name}</p>
                  <p>Selling Rate: {product.sellingRate} ₹</p>
                  {product.expiry && (
                    <p className="text-xs">
                      Expiry : ({formatDateIntl(product?.expiry)})
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </>
  );
};

export default AddByBarcode;
