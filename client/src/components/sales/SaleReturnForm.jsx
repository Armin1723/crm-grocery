import React, { useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useForm, useWatch } from "react-hook-form";
import { formatDateIntl } from "../utils";
import Divider from "../utils/Divider";
import { toast } from "react-toastify";
import Modal from "../utils/Modal";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaUser, FaWallet } from "react-icons/fa";

const SaleReturnForm = ({ sale = {}, setSale = () => {} }) => {
  const [saleReturn, setSaleReturn] = useState({});
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    reset,
    resetField,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      products: [],
      subTotal: 0,
      discount: 0,
      totalAmount: 0,
      invoiceId: "",
    },
  });

  useEffect(() => {
    setValue("products", sale.products);
  }, [sale, setValue]);

  const watchedProducts = useWatch({ name: "products", control });

  // Check expiry dates on load
  useEffect(() => {
    watchedProducts.forEach((product, index) => {
      if (product?.expiry && new Date(product?.expiry) < new Date()) {
        setError(`products.${index}.expiry`, {
          type: "manual",
          message: "This product has expired",
        });
      } else {
        clearErrors(`products.${index}.expiry`);
      }
      return () => {
        clearErrors(`products.${index}.expiry`);
      };
    });
  }, [watchedProducts, setError]);

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

    // First clear all product-related errors
    Object.keys(errors).forEach((key) => {
      if (key.startsWith("products.")) {
        clearErrors(key);
      }
    });

    // Reset the specific field
    resetField(`products.${index}`);

    // Update the products array
    setValue("products", updatedProducts);

    // Re-validate the remaining products
    updatedProducts.forEach((product, idx) => {
      // Check expiry
      if (product?.expiry && new Date(product?.expiry) < new Date()) {
        setError(`products.${idx}.expiry`, {
          type: "manual",
          message: "This product has expired",
        });
      }

      // Validate quantity
      if (product.quantity) {
        if (product.quantity < 1) {
          setError(`products.${idx}.quantity`, {
            type: "manual",
            message: "Minimum quantity is 1",
          });
        } else if (product.quantity > sale?.products[idx]?.quantity) {
          setError(`products.${idx}.quantity`, {
            type: "manual",
            message: `Maximum quantity is ${sale?.products[idx]?.quantity}`,
          });
        }
      }
    });
  };

  // Handle form submission
  const handleReturn = async (values) => {
    const id = toast.loading("Processing sale return...");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/return`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            invoiceId: sale._id,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }
      reset();
      navigate("/sales");
      toast.update(id, {
        render: "Sale returned successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const TableHeader = () => (
    <div className="th flex w-fit min-w-full flex-1 z-[99] justify-between items-center gap-2 border-b border-neutral-500/50 bg-[var(--color-card)] rounded-t-md px-2 py-1 sticky top-0">
      <div className="w-[8%] min-w-[40px]">*</div>
      <div className="w-1/5 min-w-[150px]">Name</div>
      <div className="w-1/5 min-w-[100px]">Expiry</div>
      <div className="w-1/5 min-w-[100px]">MRP</div>
      <div className="w-1/5 min-w-[100px]">Rate</div>
      <div className="w-1/5 min-w-[120px]">Quantity</div>
      <div className="w-1/5 min-w-[80px] flex justify-center">Price</div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(handleReturn)}
      className="flex flex-col w-full flex-1 h-full overflow-y-auto px-2"
    >
      {watchedProducts?.length > 0 ? (
        <>
          <div className="table-wrapper w-full flex relative flex-1 mt-2 border border-b-0 border-neutral-500/50 rounded-md rounded-b-none min-h-[12vh] overflow-x-auto">
            <div className="products-container max-sm:px-2 table flex-col w-fit min-w-full max-sm:text-sm flex-1">
              <TableHeader />
              {watchedProducts &&
                watchedProducts.map((product, index) => (
                  <div
                    key={index}
                    className="tr min-w-full w-fit flex-1 px-2 py-3 gap-2 product-item flex justify-between items-center"
                  >
                    <div className="w-[8%] flex items-center gap-1 min-w-[40px] ">
                      <IoCloseCircle
                        onClick={() => removeProduct(index)}
                        title="Remove Product"
                        className="text-red-500 hover:text-red-600 transition-all duration-300 ease-in cursor-pointer"
                      />
                    </div>
                    <div className="w-1/5 min-w-[150px] flex-wrap flex-grow">
                      {product.name}
                    </div>
                    <div
                      className={`w-1/5 min-w-[100px] ${
                        errors?.products?.[index]?.expiry ? "text-red-500" : ""
                      }`}
                    >
                      {formatDateIntl(product?.expiry) || "N/A"}
                      {errors?.products?.[index]?.expiry && (
                        <p className="text-red-500 text-xs">
                          {errors.products[index].expiry.message}
                        </p>
                      )}
                    </div>
                    <div className="w-1/5 min-w-[100px]">
                      {product.mrp}₹/{product.secondaryUnit}
                    </div>
                    <div className="w-1/5 min-w-[100px] flex items-center pr-2 relative">
                      <input
                        type="number"
                        readOnly
                        className={`w-full ${
                          product.sellingRate < product.purchaseRate
                            ? "text-red-500"
                            : ""
                        } outline-none border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] p-1`}
                        {...register(`products.${index}.sellingRate`, {
                          required: "Selling Rate is required",
                        })}
                      />
                      <span className="text-xs absolute top-1/2 -translate-y-1/2 right-2 rounded-lg bg-[var(--color-accent)] text-white px-2">
                        ₹/{product.secondaryUnit}
                      </span>
                    </div>
                    <div className="w-1/5 min-w-[120px] relative">
                      <input
                        type="number"
                        className={`${
                          errors?.products?.[index]?.quantity
                            ? "border-red-500 text-red-500"
                            : ""
                        } border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-full`}
                        {...register(`products.${index}.quantity`, {
                          valueAsNumber: true,
                          onChange: (e) => {
                            setValue(
                              `products.${index}.price`,
                              e.target.value * product.sellingRate
                            );
                          },
                          min: { value: 1, message: "Minimum quantity is 1" },
                          max: {
                            value: watchedProducts[index].quantity,
                            message: `Maximum quantity is ${sale?.products[index]?.quantity}`,
                          },
                        })}
                      />
                      <span className="text-xs absolute top-1/2 -translate-y-1/2 right-2 rounded-lg bg-[var(--color-accent)] text-white px-2">
                        {product.secondaryUnit}
                      </span>
                      {errors?.products?.[index]?.quantity && (
                        <p className="text-red-500 text-xs absolute bottom-[-1.5em]">
                          {errors.products[index].quantity.message}
                        </p>
                      )}
                    </div>
                    <div className="w-1/5 min-w-[80px] flex justify-end items-center relative">
                      <input
                        type="number"
                        min="0"
                        readOnly
                        className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-20 text-right"
                        {...register(`products.${index}.price`, {
                          valueAsNumber: true,
                          min: {
                            value: 0,
                            message: "Price cannot be negative",
                          },
                        })}
                      />
                      ₹
                      {errors?.products?.[index]?.price && (
                        <p className="text-red-500 text-xs absolute bottom-[-1.5em]">
                          {errors.products[index].price.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="table-footer flex flex-col items-end w-fit p-2 pt-0 min-w-full bg-[var(--color-card)] border border-neutral-500/50 rounded-b-md">
            <div className="text-right flex items-center">
              Sub Total:{" "}
              <input
                type="number"
                readOnly
                {...register("subTotal")}
                className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
              />
              ₹
            </div>
            <div className="text-right flex items-center">
              Discount:{" "}
              <input
                type="number"
                min="0"
                readOnly
                {...register("discount")}
                className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
              />
              ₹
              {errors.discount && (
                <p className="text-red-500 text-xs">
                  {errors.discount.message}
                </p>
              )}
            </div>
            <div className="text-right flex items-center">
              Total:{" "}
              <input
                type="number"
                readOnly
                {...register("totalAmount")}
                className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
              />
              ₹
            </div>
            {sale?.deficitAmount > 0 && (
              <div className="text-right flex items-center">
                Deficit:{" "}
                <input
                  type="number"
                  readOnly
                  value={sale?.deficitAmount}
                  className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                />
                ₹
              </div>
            )}
            {sale?.deficitAmount > 0 && (
              <div className="text-right flex items-center">
                Payable:{" "}
                <input
                  type="number"
                  readOnly
                  value={getValues("totalAmount") - sale?.deficitAmount}
                  className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                />
                ₹
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex min-h-[25vh] bg-[var(--color-card)] text-[var(--color-text-light)] justify-center items-center rounded-md my-2">
          <p className="text-center text-sm">Empty</p>
        </div>
      )}

      {/* Reason of return */}
      <Divider title="Reason of Return" />
      <textarea
        {...register("reason", {
          required: "Reason of return is required",
        })}
        className={`w-full border border-neutral-500/50 bg-transparent outline-none focus:border-accentDark rounded-md p-2 ${
          errors && errors.reason
            ? "border-red-500 focus:border-red-500 placeholder:text-red-400"
            : ""
        }`}
        placeholder="Reason of return"
      />
      {errors?.reason && (
        <p className="text-red-500">{errors.reason.message}</p>
      )}

      {/* Customer info */}
      {sale?.customer && (
        <>
          <Divider title="Customer Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-4 p-4 shadow-md rounded-lg">
            <div className="flex items-center gap-2 ">
              <FaUser className="text-blue-500" />
              <span className="font-medium">
                {sale?.customer?.name || "Name: N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2 ">
              <FaEnvelope className="text-green-500" />
              <span className=" font-medium">
                {sale?.customer?.email || "Email: N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2 ">
              <FaPhoneAlt className="text-green-500" />
              <span className=" font-medium">
                {sale?.customer?.phone || "Phone: N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2 ">
              <FaWallet className="text-yellow-600" />
              <span className="font-">
                Balance: ₹{sale?.customer?.balance?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || !sale.products || loading}
        className="disabled:opacity-30 disabled:cursor-not-allowed w-full cursor-pointer bg-accent text-white hover:bg-accentDark transition-all duration-300 p-2 rounded-md mt-2"
      >
        Confirm Return
      </button>

      {invoiceModal && (
        <Modal
          title="Sale Return Invoice"
          isOpen={invoiceModal}
          onClose={() => setInvoiceModal(false)}
        >
          <embed
            src={saleReturn?.invoice}
            type="application/pdf"
            width="100%"
            height="500px"
          />
        </Modal>
      )}
    </form>
  );
};

export default SaleReturnForm;
