import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddProductModal from "./AddProductModal";
import SaveReload from "../utils/SaveReload";
import PurchaseProductSuggestion from "./PurchaseProductSuggestion";

const PurchaseForm = ({ setRefetch = () => {}, closeModal = () => {} }) => {
  const [products, setProducts] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [suggestedSuppliers, setSuggestedSuppliers] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      supplier: "",
      products: [],
      subTotal: 0,
      otherCharges: 0,
      discount: 0,
      totalAmount: 0,
      paidAmount: 0,
    },
  });

  const subTotal = watch("subTotal", 0);
  const otherCharges = watch("otherCharges", 0);
  const discount = watch("discount", 0);

  const [globalErrors, setGlobalErrors] = useState({});

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    const calculatedSubTotal = products.reduce(
      (acc, curr) => acc + (curr.price || 0),
      0
    );
    setValue("subTotal", calculatedSubTotal);
  }, [products, setValue]);

  useEffect(() => {
    const calculatedTotal =
      Number(subTotal) - Number(discount) + Number(otherCharges);
    setValue("totalAmount", calculatedTotal);
    setValue("paidAmount", calculatedTotal);
  }, [subTotal, discount, otherCharges, setValue, products]);

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

  const normaliseCharges = () => {
    const subTotal = watch("subTotal", 0);
    const otherCharges = watch("otherCharges", 0);

    const updatedProducts = products.map((product) => {
      const sharePercent = (product.price / subTotal) * 100;
      const shareAmount = parseFloat(
        Number((sharePercent / 100) * otherCharges).toFixed(1)
      );

      return {
        ...product,
        price: product.price + shareAmount,
        purchaseRate: parseFloat(
          Number((product.price + shareAmount) / (product.quantity * product.conversionFactor)).toFixed(1)
        ),
      };
    });

    setProducts(updatedProducts);
    setValue("otherCharges", 0);
  };

  const addPurchase = async (values) => {
    const id = toast.loading("Adding purchase...");
    const emptyFields = products.some(
      (product) =>
        !product.expiry ||
        !product.sellingRate ||
        !product.price ||
        product.quantity <= 0
    );
    if (emptyFields) {
      toast.update(id, {
        render: "Please fill all the fields",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      return;
    }

    if(globalErrors){
      for (const [key, value] of Object.entries(globalErrors)) {
        toast.update(id, {
          render: value,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        return;
      }
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/purchases`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplierId: supplierId,
            products: products.map((product) => ({
              ...product,
              quantity: product.quantity * product.conversionFactor,
            })),
            subTotal: values.subTotal,
            otherCharges: values.otherCharges,
            discount: values.discount,
            totalAmount: values.totalAmount,
            paidAmount: values.paidAmount,
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
        navigate("/purchases");
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
      <form
        onSubmit={handleSubmit(addPurchase)}
        onKeyDown={handleKeyDown}
        className="flex flex-col max-sm:px-2 gap-2 w-full flex-1 h-full min-h-[50vh] justify-between "
      >
        {/* Supplier Input */}
        <p className="my-1 font-semibold text-lg max-sm:text-base">Supplier</p>
        <div className="supplier-input w-full flex flex-col relative group">
          <input
            type="text"
            placeholder="Enter Supplier Name"
            autoComplete="off"
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
        <div className="title flex justify-between flex-wrap">
          <p className="my-1 font-semibold text-lg max-sm:text-base">
            Products
          </p>

          <SaveReload
            products={products}
            setProducts={setProducts}
            name="purchaseData"
          />
        </div>

        {/* Add Product */}
        <div className="add-product flex items-end w-fit relative">
          <PurchaseProductSuggestion
            products={products}
            setProducts={setProducts}
            suggestedProducts={suggestedProducts}
            setSuggestedProducts={setSuggestedProducts}
            disabled={getValues("supplier") === ""}
          />
          <AddProductModal />
        </div>

        <div className="table-wrapper flex relative max-h-[55vh] min-h-fit flex-1 my-2 overflow-x-scroll">
          {products.length > 0 ? (
            <div className="products-container overflow-x-scroll w-fir table flex-col min-w-[1000px] max-sm:text-sm">
              <div className="th flex w-fit min-w-full flex-1 justify-between items-center gap-4 border border-neutral-500/50 bg-[var(--color-card)] font-semibold rounded-t-md px-2 py-1 sticky top-0 ">
                <p className="w-[5%] min-w-[30px]">*</p>
                <p className="w-1/5 min-w-[100px]">Name</p>
                <p className="w-1/5 min-w-[120px]">Expiry</p>
                <p className="w-1/5 min-w-[120px]">Purchase Rate</p>
                <p className="w-1/5 min-w-[120px]">Selling Rate</p>
                <p className="w-1/5 min-w-[50px]">MRP</p>
                <p className="w-1/5 min-w-[80px]">Quantity</p>
                <p className="w-1/5 min-w-[80px] flex justify-end">Price</p>
              </div>
              {products.map((product, index) => {
                return (
                  <div
                    key={index}
                    className={` ${
                      index % 2 !== 0
                        ? "bg-[var(--color-card)]"
                        : "bg-[var(--color-primary)]"
                    } tr min-w-full w-fit flex-1 px-2 py-3 gap-4 border-l border-r border-neutral-500/50 product-item flex justify-between items-center`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setProducts((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="w-[5%] min-w-[30px] text-red-500 hover:text-red-600 transition-all duration-300 ease-in"
                    >
                      <IoCloseCircle />
                    </button>
                    <p className="w-1/5 min-w-[100px] flex-wrap flex-grow">
                      {product.name}
                    </p>
                    <div className="w-1/5 min-w-[120px]">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={product.expiry}
                        className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-full"
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((p, i) =>
                              i === index
                                ? {
                                    ...p,
                                    expiry: e.target.value,
                                  }
                                : p
                            )
                          )
                        }
                      />
                    </div>
                    <div className="purchaseRate w-1/5 min-w-[120px] relative">
                      <input
                        type="number"
                        value={product.purchaseRate}
                        readOnly
                        className={`${product?.purchaseRate > product?.mrp && 'text-red-500'} w-full border-b border-accent bg-transparent outline-none p-1`}
                      />
                      <span className="text-xs absolute top-1/2 -translate-y-1/2 right-2 rounded-lg bg-accent text-white px-2">
                        ₹/{product.secondaryUnit}
                      </span>
                    </div>
                    <div className="selling-rate w-1/5 min-w-[120px] relative">
                      <input
                        type="number"
                        min={Math.ceil(product.purchaseRate)}
                        value={product.sellingRate}
                        className={` ${
                          (product.purchaseRate > product.sellingRate) ||
                          (product.sellingRate > product.mrp && "text-red-700")
                        } border-b w-full placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 `}
                        onChange={(e) => {
                          if (e.target.value < product.purchaseRate) {
                            return;
                          }
                          setProducts((prev) =>
                            prev.map((p, i) =>
                              i === index
                                ? {
                                    ...p,
                                    sellingRate: Number(e.target.value),
                                  }
                                : p
                            )
                          );
                        }}
                      />
                      <span className="text-xs absolute top-1/2 -translate-y-1/2 right-2 rounded-lg bg-accent text-white px-2">
                        ₹/{product.secondaryUnit}
                      </span>
                    </div>
                    <div className="mrp w-1/5 min-w-[80px]">
                      <input
                        type="number"
                        min={Math.ceil(product.purchaseRate)}
                        placeholder="MRP"
                        defaultValue={product.mrp}
                        className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-20 "
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((p, i) =>
                              i === index
                                ? {
                                    ...p,
                                    mrp: Number(e.target.value),
                                  }
                                : p
                            )
                          )
                        }
                      />
                    </div>
                    <div className="quantity w-1/5 min-w-[80px] relative">
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        defaultValue={1}
                        className="border-b placeholder:text-sm  bg-transparent border-[var(--color-accent)] outline-none p-1 w-full "
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((p, i) =>
                              i === index
                                ? {
                                    ...p,
                                    quantity: Number(e.target.value),
                                    purchaseRate: e.target.value
                                      ? parseFloat(
                                          Number(
                                            Number(p.price) /
                                              (Number(e.target.value) *
                                                Number(p.conversionFactor))
                                          ).toFixed(2)
                                        )
                                      : 0,
                                  }
                                : p
                            )
                          )
                        }
                      />
                      <div className="absolute text-xs px-1 rounded-lg bg-accent text-white right-2 top-1/2 -translate-y-1/2 capitalize">
                        {product.primaryUnit}
                      </div>
                    </div>
                    <div className="price w-1/5 min-w-[80px] flex justify-end">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Price"
                        value={product.price}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((p, i) =>
                              i === index
                                ? {
                                    ...p,
                                    price: Number(e.target.value),
                                    purchaseRate: e.target.value
                                      ? parseFloat(
                                          Number(
                                            Number(e.target.value) /
                                              (Number(p.quantity) *
                                                Number(p.conversionFactor))
                                          ).toFixed(2)
                                        )
                                      : 0,
                                  }
                                : p
                            )
                          )
                        }
                        className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                      />
                    </div>
                  </div>
                );
              })}

              <div className="table-footer flex-1 flex flex-col items-end w-fit min-w-full py-1 bg-[var(--color-card)] px-2 border border-neutral-500/50 rounded-b-md">
                <div className="text-right flex items-center">
                  Sub Total:{" "}
                  <input
                    type="number"
                    readOnly
                    className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                    {...register("subTotal")}
                  />
                  ₹
                </div>
                <div className="text-right flex items-center">
                  <div className="title flex items-center gap-2">
                    <span
                      className="text-accent/80 hover:text-accentDark transition-all duration-300 ease-in cursor-pointer"
                      onClick={normaliseCharges}
                    >
                      <FaRobot />
                    </span>
                    <span>Other Charges: </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                    {...register("otherCharges")}
                  />
                  ₹
                </div>
                <div className="text-right flex items-center">
                  Discount:{" "}
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                    {...register("discount")}
                  />
                  ₹
                </div>
                <div className="text-right flex items-center">
                  Total:{" "}
                  <input
                    type="number"
                    readOnly
                    className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                    {...register("totalAmount")}
                    value={
                      Number(watch("subTotal", 0)) -
                      Number(watch("discount", 0)) +
                      Number(watch("otherCharges", 0))
                    }
                  />
                  ₹
                </div>
                <div className="text-right flex items-center">
                  Paid Amount:{" "}
                  <input
                    type="number"
                    min="0"
                    defaultValue={watch("totalAmount", 0)}
                    max={watch("totalAmount", 0)}
                    className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                    {...register("paidAmount")}
                  />
                  ₹
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full min-h-[25vh] my-1 bg-[var(--color-card)] rounded-md border border-neutral-500/50">
              <p className="text-lg text-neutral-500">No products added</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={products.length === 0 || Object.keys(errors).length > 0}
          className="px-3 py-1.5 my-2 capitalize rounded-md disabled:bg-gray-600 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover-none bg-accent hover:bg-accentDark text-white"
        >
          Add Purchase
        </button>
      </form>
  );
};

export default PurchaseForm;
