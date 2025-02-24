import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const AddPurchaseByBarcode = ({ getValues = [], setValue = () => {}, disabled = false }) => {
  const inputRef = useRef(null);

  const products = getValues("products");

  const defaultExpiry = (shelfLife) => {
    if (!shelfLife) return "";
    const date = new Date();
    date.setDate(date.getDate() + shelfLife);
    return date.toISOString().split("T")[0];
  };

  const handleProductUpdate = (product) => {
    const existingProduct = products.find((p) => (p.upid = product.upid));

    if (existingProduct) {
      const updatedProducts = products.map((p) =>
        p.upid === product.upid
          ? {
              ...p,
              quantity: p.quantity + 1,
              price: (p.quantity + 1) * p.purchaseRate,
            }
          : p
      );
      setValue("products", updatedProducts);
    } else {
      setValue("products", [
        ...products,
        {
          ...product,
          quantity: 1,
          expiry: defaultExpiry(product.shelfLife),
          purchaseRate: product?.rate,
          price: product?.rate * product?.conversionFactor, 
        },
      ]);
    }
  };

  const fetchProductByBarcode = async (barcode) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/${barcode}`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data.product;
    } catch (error) {
      toast.error(error.message, { autoClose: 2000 });
      return null;
    }
  };

  const handleBarcodeInput = async (e) => {
    const barcode = e.target.value;
    if (barcode.length <= 9) return;

    const product = await fetchProductByBarcode(barcode);
    e.target.value = "";

    if (!product) {
      toast.error("Not added.", { autoClose: 2000 });
      return;
    }

    handleProductUpdate(product);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
        disabled={disabled}
      placeholder={disabled ? "Disabled" : "Barcode"}
      onChange={handleBarcodeInput}

      className="border border-neutral-500 bg-transparent p-1 pl-2 rounded-md outline-none max-sm:flex-1 disabled:cursor-not-allowed"
    />
  );
};

export default AddPurchaseByBarcode;
