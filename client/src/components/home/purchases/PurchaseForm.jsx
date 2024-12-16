import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";

const PurchaseForm = ({ setRefetch = () => {}, closeModal = () => {} }) => {
  const [products, setProducts] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [suggestedSuppliers, setSuggestedSuppliers] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      supplier: "",
      products: [],
      otherCharges: 0,
      discount: 0,
    },
  });

  const fetchSuggestedSuppliers = async (e) => {
    const value = e.target.value;
    if (value.length > 1) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/suppliers?name=${value}`,
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestedSuppliers(data.suppliers);
        } else {
          throw new Error("Failed to fetch suggested suppliers");
        }
      } catch (error) {
        console.error("Error fetching suggested suppliers:", error.message);
      }
    } else {
      setSuggestedSuppliers([]);
    }
  };

  const fetchSuggestedProducts = async (e) => {
    const value = e.target.value;
    if (value.length > 1) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/products?name=${value}`,
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestedProducts(data.products);
        } else {
          throw new Error("Failed to fetch suggested products");
        }
      } catch (error) {
        console.error("Error fetching suggested products:", error.message);
      }
    } else {
      setSuggestedProducts([]);
    }
  };

  const addPurchase = async (values) => {
    const id = toast.loading("Adding purchase...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/purchases`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplier: supplierId,
            products: products.map((product) => ({
              productId: product._id,
              quantity: product.quantity || 1,
            })),
            otherCharges: values.otherCharges,
            discount: values.discount,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.update(id, {
          render: data.message || "Failed to add purchase",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(id, {
          render: "Purchase added successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        reset();
        setProducts([]);
        setRefetch((prev) => !prev);
        closeModal();
      }
    } catch (error) {
      toast.update(id, {
        render: "Failed to add purchase",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(addPurchase)}
        className="flex flex-col gap-2 w-full flex-1 min-h-[50vh]"
      >
        {/* Supplier Input */}
        <p className="my-1 font-semibold text-lg max-sm:text-base">Supplier</p>
        <div className="supplier-input w-full flex flex-col relative group my-2">
          <input
            type="text"
            placeholder="Enter Supplier Name"
            className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
              errors.supplier && "border-red-500 focus:!border-red-500"
            }`}
            {...register("supplier", {
              required: "Supplier name is required",
              onChange: fetchSuggestedSuppliers,
            })}
          />
          {suggestedSuppliers.length > 0 && (
            <div className="suggested-suppliers w-full absolute top-full left-0 bg-[var(--color-card)] rounded-md shadow-md border border-neutral-500/50">
              {suggestedSuppliers.map((supplier) => (
                <div
                  key={supplier._id}
                  className="supplier-option px-3 py-2 text-sm hover:bg-accentDark/20 transition-all duration-300 ease-in cursor-pointer"
                  onClick={() => {
                    setValue("supplier", supplier.name);
                    setSupplierId(supplier._id);
                    setSuggestedSuppliers([]);
                  }}
                >
                  {supplier.name}
                </div>
              ))}
            </div>
          )}
          {errors.supplier && (
            <span className="text-red-500 text-sm">
              {errors.supplier.message}
            </span>
          )}
        </div>

        {/* Products Section */}
        <p className="my-1 font-semibold text-lg max-sm:text-base">Products</p>
        {/* Add Product */}
        <div className="flex items-end w-fit justify-end relative">
          <input
            type="text"
            placeholder="Search for product"
            className="border border-[var(--color-accent)] bg-transparent outline-none pl-2 rounded-md p-1"
            onChange={fetchSuggestedProducts}
          />
          {suggestedProducts.length > 0 && (
            <div className="suggested-products w-full absolute top-full left-0 bg-[var(--color-card)] rounded-md shadow-md border border-neutral-500/50">
              {suggestedProducts.map((product) => (
                <div
                  key={product._id}
                  className="supplier-option px-3 py-2 text-sm hover:bg-accentDark/20 transition-all duration-300 ease-in cursor-pointer"
                  onClick={() => {
                    setProducts((prev) => [...prev, product]);
                    setSuggestedProducts([]);
                  }}
                >
                  {product.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {products.length > 0 && (
          <div className="products-container flex flex-col w-full">
            <div className="th flex w-full items-center border border-neutral-500/50 bg-[var(--color-card)] rounded-t-md px-2 py-1 sticky top-0 ">
              <p className="w-[5%]">*</p>
              <p className="w-1/5">Name</p>
              <p className="w-1/5">Category</p>
              <p className="w-1/5">MRP</p>
              <p className="w-1/5">Quantity</p>
              <p className="w-1/5">Total</p>
            </div>
            {products.map((product, index) => (
              <div
                key={index}
                className="tr px-2 py-3 border-l border-r border-neutral-500/50 product-item flex justify-between items-center"
              >
                <button
                  type="button"
                  onClick={() =>
                    setProducts((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="w-[5%] text-red-500 hover:text-red-600 transition-all duration-300 ease-in"
                >
                  <IoCloseCircle />
                </button>
                <p className="w-1/5">{product.name}</p>
                <p className="w-1/5">{product.category}</p>
                <p className="w-1/5">
                  <input
                    type="number"
                    placeholder="MRP"
                    value={product.rate}
                    className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-20"
                  />
                </p>
                <div className="w-1/5 flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={product.quantity || 1}
                    className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-20 "
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p, i) =>
                          i === index ? { ...p, quantity: e.target.value } : p
                        )
                      )
                    }
                  />
                  <span className="capitalize">{product.unit}</span>
                </div>
                <p className="w-1/5">
                  {product.rate
                    ? `${(product.quantity || 1) * product.rate}₹`
                    : "N/A"}
                </p>
              </div>
            ))}

            <div className="table-footer py-1 bg-[var(--color-card)] px-2 border border-neutral-500/50 rounded-b-md">
              <p className="text-right">
                Sub Total:{" "}
                {products.reduce(
                  (acc, curr) =>
                    acc + (curr.rate ? curr.rate * curr.quantity : 0),
                  0
                )}
                ₹
              </p>
              <p className="text-right">
                Other Charges:{" "}
                <input
                  type="number"
                  vlaue={0}
                  className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20 "
                  {...register("otherCharges")}
                />
                ₹
              </p>
              <p className="text-right">
                Discount:{" "}
                <input
                  type="number"
                  value={0}
                  className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20 "
                  {...register("discount")}
                />
                ₹
              </p>
              <p className="text-right">
                Total:{" "}
                {products.reduce(
                  (acc, curr) =>
                    acc + (curr.rate ? curr.rate * curr.quantity : 0),
                  0
                ) -
                  getValues('discount') +
                  getValues('otherCharges')
                  }
                ₹
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="px-3 py-1.5 my-2 capitalize rounded-md bg-accent hover:bg-accentDark text-white"
        >
          Add Purchase
        </button>
      </form>
    </div>
  );
};

export default PurchaseForm;
