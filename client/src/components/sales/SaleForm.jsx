import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import AddByBarcode from "./AddByBarcode";
import SaleProductSuggestion from "./SaleProductSuggestion";
import { formatDateIntl } from "../utils";
import AddCustomerModal from "../customer/AddCustomerModal";
import Divider from "../utils/Divider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomerSuggestion from "../utils/CustomerSuggestion";

const SaleForm = ({ setRefetch = () => {}, closeModal = () => {} }) => {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isAdmin = user && user?.role === "admin";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      customerMobile: "",
      products: [],
      subTotal: 0,
      discount: 0,
      totalAmount: 0,
      paymentType: "cash",
    },
  });

  useEffect(() => {
    if (customerDetails?.phone) {
      setCustomerLoading(false);
      setValue("customerMobile", customerDetails.phone);
    }
  }, [customerDetails]);

  const subTotal = useWatch({ name: "subTotal", control });
  const discount = useWatch({ name: "discount", control });
  const watchedProducts = useWatch({ name: "products", control });

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    const calculatedSubTotal = watchedProducts.reduce(
      (acc, curr) =>
        acc + ((curr.mrp || curr.sellingRate) * curr.quantity || 0),
      0
    );
    const calculatedDiscount = watchedProducts.reduce(
      (acc, curr) =>
        acc + (curr.mrp ? curr.mrp - curr.sellingRate : 0) * curr.quantity,
      0
    );
    setValue("subTotal", calculatedSubTotal);
    setValue("discount", calculatedDiscount);
    setValue("totalAmount", calculatedSubTotal - calculatedDiscount);
  }, [watchedProducts, setValue]);

  const removeProduct = (index) => {
    const updatedProducts = [...watchedProducts];
    updatedProducts.splice(index, 1);
    setValue("products", updatedProducts);
  };

  const addSale = async (values) => {
    console.log(values);
    return;
    const id = toast.loading("Adding sale...");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/sales`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerMobile: values.customerMobile,
            products: values.products,
            subTotal: values.subTotal,
            discount,
            totalAmount: values.totalAmount,
            paymentType: values.paymentType,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.update(id, {
          render: data.message || "Failed to add sale",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(id, {
          render: "Sale added successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        reset();
        setRefetch((prev) => !prev);
        navigate(
          isAdmin
            ? `/sales/${data?.sale?._id}`
            : `/seller/sales/${data?.sale?._id}`
        );
      }
    } catch (error) {
      toast.update(id, {
        render: "Failed to add sale",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(addSale)}
      onKeyDown={handleKeyDown}
      className="flex flex-col w-full flex-1 px-2 overflow-y-auto "
    >
      {/* Products Section */}
      <div className="title flex justify-between py-1">
        <p className="my-1 font-semibold text-lg max-sm:text-base">Products</p>
      </div>

      {/* Add Product */}
      <div className="add-product flex items-center max-sm:space-y-2 py-2 w-full pr-2 flex-wrap relative justify-between">
        <SaleProductSuggestion
          getValues={getValues}
          setValue={setValue}
          suggestedProducts={suggestedProducts}
          setSuggestedProducts={setSuggestedProducts}
        />
        <AddByBarcode getValues={getValues} setValue={setValue} />
      </div>
      {watchedProducts.length > 0 ? (
        <>
          <div className="table-wrapper overflow-x-auto overflow-y-visible hide-scrollbar min-h-[20vh] flex relative flex-1 mt-2 border border-b-0 border-neutral-500/50 rounded-md rounded-b-none">
            <div className="products-container overflow-x-auto hide-scrollbar table flex-col w-fit max-w-full max-sm:text-sm flex-1">
              <div className="th flex w-fit min-w-full flex-1 z-[99] justify-between items-center gap-2 border-b border-neutral-500/50 bg-[var(--color-card)] rounded-t-md px-2 py-1 sticky top-0">
                <p className="w-[5%] min-w-[30px]">*</p>
                <p className="w-1/4 min-w-[200px]">Name</p>
                <p className="w-1/5 min-w-[80px]">Expiry</p>
                <p className="w-1/5 min-w-[100px]">MRP</p>
                <p className="w-1/5 min-w-[100px]">Rate</p>
                <p className="w-1/5 min-w-[120px]">Quantity</p>
                <p className="w-1/5 min-w-[80px] flex justify-center">Price</p>
              </div>
              {watchedProducts.map((product, index) => (
                <div
                  key={index}
                  className={` ${
                    index % 2 == 0
                      ? "bg-[var(--color-card)]"
                      : "bg-[var(--color-primary)]"
                  } tr min-w-full w-fit flex-1 px-2 py-3 gap-2 product-item flex justify-between items-center`}
                >
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="w-[5%] min-w-[30px] text-red-500 hover:text-red-600 transition-all duration-300 ease-in"
                  >
                    <IoCloseCircle />
                  </button>
                  <p className="w-1/4 min-w-[200px] flex-wrap flex-grow">
                    {product.name}
                  </p>
                  <p className="w-1/5 min-w-[80px]">
                    {formatDateIntl(product?.expiry) || "N/A"}
                  </p>
                  <p className="w-1/5 min-w-[100px]">
                    {product.mrp} ₹/{product.secondaryUnit}
                  </p>
                  <div className="w-1/5 min-w-[100px] flex flex-col items-start pr-2 relative">
                    <input
                      type="number"
                      {...register(`products.${index}.sellingRate`, {
                        valueAsNumber: true,
                        required: `Rate is required`,
                        min: {
                          value: Math.floor(product?.purchaseRate),
                          message: `Selling Rate smaller than Purchase.`,
                        },
                        max: {
                          value: product.mrp,
                          message: `Selling rate greater than MRP.`,
                        },
                        onChange: (e) => {
                          setValue(
                            `products.${index}.price`,
                            e.target.value * product.quantity
                          );
                        },
                      })}
                      className={`w-full ${
                        errors?.products?.[index]?.sellingRate &&
                        "border-red-500 text-red-500 focus:text-red-500"
                      } outline-none border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] p-1`}
                    />
                    {errors?.products?.[index]?.sellingRate && (
                      <p className="text-red-500 text-xs absolute top-full">
                        {errors?.products?.[index]?.sellingRate.message}
                      </p>
                    )}
                    <span className="text-xs absolute top-1/2 -translate-y-1/2 right-2 rounded-lg bg-accent text-white px-2">
                      ₹/{product.secondaryUnit}
                    </span>
                  </div>
                  <div className="w-1/5 min-w-[120px] relative">
                    <input
                      type="number"
                      placeholder="Quantity"
                      min={
                        product.secondaryUnit === "kg" ||
                        product.secondaryUnit === "l"
                          ? 0.25
                          : 1
                      }
                      max={product.maxQuantity}
                      step={
                        product.secondaryUnit === "kg" ||
                        product.secondaryUnit === "l"
                          ? 0.25
                          : 1
                      }
                      className={`border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-full ${
                        errors?.products?.[index]?.quantity &&
                        "text-red-500 border-red-500 focus:border-red-500"
                      }`}
                      {...register(`products.${index}.quantity`, {
                        valueAsNumber: true,
                        required: `Quantity is required`,
                        min: {
                          value:
                            watchedProducts[index]?.secondaryUnit === "kg" ||
                            watchedProducts[index]?.secondaryUnit === "l"
                              ? 0.25
                              : 1,
                          message: `Invalid Quantity`,
                        },
                        max: {
                          value: product.maxQuantity,
                          message: `Quantity exceeds available stock.`,
                        },
                        onChange: (e) => {
                          setValue(
                            `products.${index}.price`,
                            product.sellingRate * e.target.value
                          );
                        },
                      })}
                    />
                    <span className="text-xs absolute top-1/2 -translate-y-1/2 right-2 rounded-lg bg-accent text-white px-2">
                      {product.secondaryUnit}
                    </span>
                    {errors?.products?.[index]?.quantity && (
                      <p className="text-red-500 text-xs absolute top-full">
                        {errors?.products?.[index]?.quantity.message}
                      </p>
                    )}
                  </div>
                  <div className="w-1/5 min-w-[80px] flex justify-end items-center">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Price"
                      readOnly
                      {...register(`products.${index}.price`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          setValue(
                            `products.${index}.sellingRate`,
                            e.target.value / product?.quantity
                          );
                        },
                      })}
                      className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-20 text-right"
                    />
                    ₹
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="table-footer text-xs md:text-sm flex flex-col items-end w-fit p-2 pt-0 min-w-full bg-[var(--color-card)] border border-neutral-500/50 rounded-b-md">
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
            <div
              className={`${
                errors?.discount && "text-red-500"
              } text-right flex items-center`}
            >
              Discount:{" "}
              <input
                type="number"
                min={0}
                readOnly
                className={` ${
                  errors?.discount &&
                  "border-red-500 text-red-500 focus:border-red-500"
                } border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20`}
                {...register("discount", {
                  valueAsNumber: true,
                  required: "Discount is required",
                  min: {
                    value: 0,
                    message: "Invalid discount",
                  },
                  max: {
                    value: Number(watch("subTotal", 0)),
                    message: "Discount greater than total",
                  },
                })}
              />
              <div
                className="cursor-pointer"
                onClick={() =>
                  setDiscountType((p) =>
                    p === "number" ? "percent" : "number"
                  )
                }
              >
                ₹
              </div>
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
                  Number(watch("tax", 0))
                }
              />
              ₹
            </div>
            <div className="text-right flex items-center">
              Type:{" "}
              <select
                {...register("paymentType")}
                className="outline-none border-b p-1 w-[5.5rem] px-2 text-right border-[var(--color-accent)] text-xs !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer "
              >
                <option className="bg-[var(--color-card)] px-2" value="cash">
                  Cash
                </option>
                <option className="bg-[var(--color-card)] px-2" value="card">
                  Card
                </option>
                <option className="bg-[var(--color-card)] px-2" value="upi">
                  UPI
                </option>
              </select>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex min-h-[25vh] bg-[var(--color-card)] justify-center items-center rounded-md my-2">
          <p className="text-center text-lg">No products added</p>
        </div>
      )}

      {/* Customer Section */}
      {watchedProducts.length > 0 && (
        <div className="flex flex-col w-full py-2">
          <div className="flex items-center gap-2">
            <p className="my-1 font-semibold text-lg max-sm:text-base">
              Customer
            </p>
            <AddCustomerModal
              title="add"
              setValue={setValue}
              customer={customerDetails}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row gap-2">
            <CustomerSuggestion
              setCustomerDetails={setCustomerDetails}
              type="phone"
            />
            <CustomerSuggestion
              setCustomerDetails={setCustomerDetails}
              type="name"
            />
          </div>
        </div>
      )}

      {/* Customer Details */}
      {!customerLoading && (
        <div
          className={`flex flex-col w-full ${!customerDetails && "hidden"} `}
        >
          <Divider
            title={
              <div className="flex items-center gap-2">
                <p>Customer Details</p>
                <AddCustomerModal
                  title="edit"
                  setValue={setValue}
                  customer={customerDetails}
                />
              </div>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            <p className="w-full rounded-md border border-accent p-2">
              {customerDetails?.name || "Name"}
            </p>
            <p className="w-full rounded-md border border-accent p-2">
              {customerDetails?.email || "Email"}
            </p>
            <p className="w-full rounded-md border border-accent p-2">
              {customerDetails?.phone || "Phone"}
            </p>
            <p className="w-full rounded-md border border-accent p-2">
              {customerDetails?.address || "Address"}
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || loading}
        className="px-3 py-1.5 my-2 capitalize rounded-md disabled:cursor-not-allowed disabled:hover-none disabled:opacity-30 bg-accent hover:bg-accentDark text-white"
      >
        Add Sale
      </button>
    </form>
  );
};

export default SaleForm;
