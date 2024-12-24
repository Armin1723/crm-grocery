import React from "react";
import { toast } from "react-toastify";

const AddByBarcode = ({ products = [], setProducts = () => {} }) => {

  const addByBarcode = async (e) => {
    if (e.target.value.length == 9) {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/inventory/products?barcode=${e.target.value}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      
      if (
        products.some(
          (product) => product._id === data?.products[0]?.details?._id
        )
      ) {
        setProducts((prev) => {
          const updatedProducts = prev.map((product) => {
            if (product._id === data?.products[0]?.details?._id) {
              if (product.quantity < product.maxQuantity) {
                product.quantity += 1;
                product.price = product.quantity * product.sellingRate;
              } else {
                toast.error("Maximum quantity in stock", { autoClose: 2000 });
              }
            }
            return product;
          });
          return updatedProducts;
        });
        e.target.value = "";
        return;
      }
      setProducts((prev) => [
        ...prev,
        {
          _id: data?.products[0]?.details?._id,
          name: data?.products[0]?.details?.name,
          category: data?.products[0]?.details?.category,
          unit: data?.products[0]?.details?.unit,
          quantity: 1,
          maxQuantity: data?.products[0]?.quantity,
          purchaseRate: data?.products[0]?.purchaseRate || 0,
          sellingRate: data?.products[0]?.sellingRate,
          price: 0,
        },
      ]);
      e.target.value = "";
    }
  };
  return (
    <input
      type="text"
      placeholder="Barcode"
      onChange={addByBarcode}
      className="border border-neutral-500 bg-transparent p-1 pl-2 rounded-md outline-none"
    />
  );
};

export default AddByBarcode;
