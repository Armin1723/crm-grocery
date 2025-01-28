import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddProductModal from "./AddProductModal";
import SaveReload from "../utils/SaveReload";
import PurchaseProductSuggestion from "./PurchaseProductSuggestion";
import HoverCard from "../shared/HoverCard";
import AddPurchaseByBarcode from "./AddPurchaseByBarcode";
import InventoryCard from "../inventory/InventoryCard";

const PurchaseForm = ({ setRefetch = () => {}, closeModal = () => {} }) => {
  const [supplierId, setSupplierId] = useState("");
  const [suggestedSuppliers, setSuggestedSuppliers] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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

  const watchedProducts = useWatch({ name: "products", control });
  const subTotal = useWatch({ name: "subTotal", control });
  const otherCharges = useWatch({ name: "otherCharges", control });
  const discount = useWatch({ name: "discount", control });

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    const calculatedSubTotal = watchedProducts.reduce(
      (acc, curr) => acc + (curr.price || 0),
      0
    );
    setValue("subTotal", calculatedSubTotal);
    setValue("totalAmount", calculatedSubTotal - discount + otherCharges);
    setValue("paidAmount", calculatedSubTotal - discount + otherCharges);
  }, [watchedProducts, setValue, discount, otherCharges]);

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
    const updatedProducts = watchedProducts?.map((product) => {
      const sharePercent = (product.price / subTotal) * 100;
      const shareAmount = parseFloat(
        Number((sharePercent / 100) * otherCharges).toFixed(1)
      );

      return {
        ...product,
        price: product.price + shareAmount,
        purchaseRate: parseFloat(
          Number(
            (product.price + shareAmount) /
              (product.quantity * product.conversionFactor)
          ).toFixed(1)
        ),
      };
    });

    setValue("products", updatedProducts);
    setValue("otherCharges", 0);
  };

  const removeProduct = (index) => {
    const updatedProducts = [...watchedProducts];
    updatedProducts.splice(index, 1);
    setValue("products", updatedProducts);
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
            supplierId: supplierId,
            products: values?.products?.map((product) => ({
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
        <p className="my-1 font-semibold text-lg max-sm:text-base">Products</p>

        <SaveReload
          products={getValues("products")}
          setProducts={(products) => setValue("products", products)}
          name="purchaseData"
        />
      </div>

      <div className="add-product w-full relative flex items-center justify-between flex-wrap gap-2 ">
        <div className="left flex items-center flex-wrap gap-2">
          <PurchaseProductSuggestion
            getValues={getValues}
            setValue={setValue}
            suggestedProducts={suggestedProducts}
            setSuggestedProducts={setSuggestedProducts}
            disabled={getValues("supplier") === ""}
          />
          <AddProductModal />
        </div>
        <AddPurchaseByBarcode
          getValues={getValues}
          setValue={setValue}
          disabled={getValues("supplier") === ""}
        />
      </div>

      <div className="table-wrapper flex relative max-h-[55vh] min-h-fit flex-1 my-2 overflow-x-scroll">
        {watchedProducts.length > 0 ? (
          <div className="products-container overflow-x-scroll w-fir table flex-col min-w-[1000px] max-sm:text-sm">
            <div className="th flex w-fit min-w-full flex-1 justify-between items-center gap-4 border border-neutral-500/50 bg-[var(--color-card)] font-semibold rounded-t-md px-2 py-1 sticky top-0 z-[99]">
              <p className="w-[5%] min-w-[30px]">*</p>
              <p className="w-1/5 min-w-[100px]">Name</p>
              <p className="w-1/5 min-w-[120px]">Expiry</p>
              <p className="w-1/5 min-w-[120px]">Purchase Rate</p>
              <p className="w-1/5 min-w-[120px]">Selling Rate</p>
              <p className="w-1/5 min-w-[50px]">MRP</p>
              <p className="w-1/5 min-w-[80px]">Quantity</p>
              <p className="w-1/5 min-w-[80px] flex justify-end">Price</p>
            </div>
            {watchedProducts &&
              watchedProducts.map((product, index) => {
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
                      onClick={() => removeProduct(index)}
                      className="w-[5%] min-w-[30px] text-red-500 hover:text-red-600 transition-all duration-300 ease-in"
                    >
                      <IoCloseCircle />
                    </button>
                    <p
                      onClick={() => setProductPreviewModal(true)}
                      className="w-1/5 min-w-[100px] flex-wrap flex-grow"
                    >
                      <HoverCard title={product?.name} otherClasses="max-w-3xl z-[999]">
                        <InventoryCard upid={product?.upid} />
                      </HoverCard>
                    </p>
                    <div className="w-1/5 min-w-[120px]">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-full"
                        {...register(`products.${index}.expiry`)}
                      />
                    </div>
                    <div className="purchaseRate w-1/5 min-w-[120px] relative">
                      <input
                        type="number"
                        readOnly
                        className={`${
                          product?.purchaseRate > product?.mrp && "text-red-500"
                        } w-full border-b border-accent bg-transparent outline-none p-1`}
                        {...register(`products.${index}.purchaseRate`)}
                      />
                      <span className="text-xs absolute top-1/2 -translate-y-1/2 right-2 rounded-lg bg-accent text-white px-2">
                        ₹/{product.secondaryUnit}
                      </span>
                    </div>
                    <div className="selling-rate w-1/5 min-w-[120px] relative">
                      <input
                        type="number"
                        className={` ${
                          errors?.products?.[index]?.sellingRate &&
                          "text-red-700 border-red-500"
                        } border-b w-full placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 `}
                        {...register(`products.${index}.sellingRate`, {
                          required: "Selling Rate is required",
                          valueAsNumber: true,
                          min: {
                            value: getValues(`products.${index}.purchaseRate`),
                            message:
                              "Selling rate should be greater than purchase rate",
                          },
                        })}
                      />
                      <span className="text-xs absolute top-1/2 -translate-y-1/2 right-2 rounded-lg bg-accent text-white px-2">
                        ₹/{product.secondaryUnit}
                      </span>
                      {errors && errors?.products?.[index]?.sellingRate && (
                        <span className="text-red-500 text-xs absolute top-full left-0">
                          {errors.products[index].sellingRate.message}
                        </span>
                      )}
                    </div>
                    <div className="mrp w-1/5 min-w-[80px]">
                      <input
                        type="number"
                        min={Math.ceil(product.purchaseRate)}
                        placeholder="MRP"
                        defaultValue={product.mrp}
                        className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-20 "
                        {...register(`products.${index}.mrp`)}
                      />
                    </div>
                    <div className="quantity w-1/5 min-w-[80px] relative">
                      <input
                        type="number"
                        min="1"
                        className="border-b placeholder:text-sm  bg-transparent border-[var(--color-accent)] outline-none p-1 w-full "
                        {...register(`products.${index}.quantity`, {
                          required: "Quantity is required",
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: "Quantity should be greater than 0",
                          },
                          onChange: (e) => {
                            const price = getValues(`products.${index}.price`);
                            const conversionFactor = getValues(
                              `products.${index}.conversionFactor`
                            );
                            const inputValue = e.target.value;

                            const purchaseRate = (
                              price /
                              (inputValue * conversionFactor)
                            ).toFixed(2);

                            setValue(
                              `products.${index}.purchaseRate`,
                              parseFloat(purchaseRate)
                            );
                          },
                        })}
                      />
                      <div
                        title={`1 ${product?.primaryUnit} = ${product?.conversionFactor} ${product?.secondaryUnit}`}
                        className="absolute text-xs px-1 rounded-lg bg-accent text-white right-2 top-1/2 -translate-y-1/2 capitalize cursor-pointer"
                      >
                        {product.primaryUnit}
                      </div>
                    </div>
                    <div className="price w-1/5 min-w-[80px] flex justify-end relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Price"
                        {...register(`products.${index}.price`, {
                          required: "Price is required",
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: "Price should be greater than 0",
                          },
                          onChange: (e) => {
                            const quantity = getValues(
                              `products.${index}.quantity`
                            );
                            const conversionFactor = getValues(
                              `products.${index}.conversionFactor`
                            );
                            const inputValue = e.target.value;

                            const purchaseRate = (
                              inputValue /
                              (quantity * conversionFactor)
                            ).toFixed(2);

                            setValue(
                              `products.${index}.purchaseRate`,
                              parseFloat(purchaseRate)
                            );
                          },
                        })}
                        className={` ${
                          errors &&
                          errors?.products?.[index]?.price &&
                          "text-red-500 border-red-500"
                        } border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20`}
                      />
                      {errors && errors?.products?.[index]?.price && (
                        <span className="text-red-500 text-xs absolute top-full">
                          {errors.products[index].price.message}
                        </span>
                      )}
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
                  {...register("subTotal", {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Subtotal should be greater than 0",
                    },
                  })}
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
                  {...register("otherCharges", {
                    valueAsNumber: true,
                  })}
                />
                ₹
              </div>
              <div className="text-right flex items-center">
                Discount:{" "}
                <input
                  type="number"
                  step="0.1"
                  className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                  {...register("discount", {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Discount should be greater than 0",
                    },
                  })}
                />
                ₹
              </div>
              <div className="text-right flex items-center">
                Total:{" "}
                <input
                  type="number"
                  readOnly
                  className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                  {...register("totalAmount", {
                    valueAsNumber: true,
                  })}
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
        disabled={Object.keys(errors).length > 0}
        className="px-3 py-1.5 my-2 capitalize rounded-md disabled:bg-gray-600 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover-none bg-accent hover:bg-accentDark text-white"
      >
        Add Purchase
      </button>
    </form>
  );
};

export default PurchaseForm;
