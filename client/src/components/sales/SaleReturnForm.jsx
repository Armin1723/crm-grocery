import React, { useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useForm, useWatch } from "react-hook-form";
import { formatDateIntl } from "../utils";
import Divider from "../utils/Divider";
import { toast } from "react-toastify";
import Modal from "../utils/Modal"; 

const SaleReturnForm = ({ sale = {}, setSale = () => {}, loading = false }) => {
  const [saleReturn, setSaleReturn] = useState({});
  const [invoiceModal, setInvoiceModal] = useState(false);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    reset,
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
    reset({
      subTotal: sale?.subTotal || 0,
      discount: sale?.discount || 0,
      totalAmount: sale?.totalAmount || 0,
      otherCharges: sale?.otherCharges || 0,
      products: sale?.products || [],
      invoiceId: sale?._id || "",
    });
  }, [sale, reset]);

  // Check expiry dates on load
  useEffect(() => {
    getValues("products").forEach((product, index) => {
      if (new Date(product?.expiry) < new Date()) {
        setError(`products.${index}.expiry`, {
          type: "manual",
          message: "This product has expired",
        });
      } else {
        clearErrors(`products.${index}.expiry`);
      }
      return(() => {
        clearErrors(`products.${index}.expiry`);
      })
    });
  }, [getValues("products"), setError]);

  const watchedProducts = useWatch({ name: "products", control });
  const watchedDiscount = useWatch({ name: "discount", control });

  useEffect(() => {
    const subTotal = watchedProducts?.reduce((acc, item) => {
      const price = parseFloat(item.sellingRate * item.quantity) || 0;
      return acc + price;
    }, 0);

    const discount = parseFloat(watchedDiscount) || 0;
    setValue("subTotal", subTotal);
    setValue("totalAmount", subTotal - discount);
  }, [watchedProducts, setValue]);

  const removeProduct = (index) => {
    const updatedProducts = [...watchedProducts];
    updatedProducts.splice(index, 1);
    setValue("products", updatedProducts);
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
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }
      setSale({});
      setSaleReturn(data.saleReturn);
      reset();
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
    <div className="th flex w-fit min-w-full flex-1 z-[99] justify-between items-center gap-2 border border-neutral-500/50 bg-[var(--color-card)] rounded-t-md px-2 py-1 sticky top-0">
      <div className="w-[8%] min-w-[40px]">*</div>
      <div className="w-1/5 min-w-[150px]">Name</div>
      <div className="w-1/5 min-w-[100px]">Expiry</div>
      <div className="w-1/5 min-w-[100px]">MRP</div>
      <div className="w-1/5 min-w-[100px]">Rate</div>
      <div className="w-1/5 min-w-[120px]">Quantity</div>
      <div className="w-1/5 min-w-[80px] flex justify-center">Price</div>
    </div>
  );

  const ProductRow = ({ product, index }) => (
    <div className="tr min-w-full w-fit flex-1 px-2 py-3 gap-2 product-item flex justify-between items-center">
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
        {formatDateIntl(product.expiry)}
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
            product.sellingRate < product.purchaseRate ? "text-red-500" : ""
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
              value: sale?.products[index].quantity || 1,
              message: `Maximum quantity is ${sale?.products[index].quantity}`,
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
            min: { value: 0, message: "Price cannot be negative" },
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
  );

  return (
    <form
      onSubmit={handleSubmit(handleReturn)}
      className="flex flex-col w-full flex-1 h-full overflow-y-auto px-2"
    >
      {watchedProducts?.length > 0 ? (
        <>
          <div className="table-wrapper flex relative flex-1 mt-2 border border-b-0 border-neutral-500/50 rounded-md rounded-b-none overflow-x-auto">
            <div className="products-container overflow-x-auto overflow-y-auto max-sm:px-2 table flex-col w-fit min-w-full max-sm:text-sm flex-1">
              <TableHeader />
              {watchedProducts.map((product, index) => (
                <ProductRow key={index} product={product} index={index} />
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
                step="0.1"
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
          </div>
        </>
      ) : (
        <div className="flex-1 flex min-h-[25vh] bg-[var(--color-card)] justify-center items-center rounded-md my-2">
          <p className="text-center text-lg">Empty</p>
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
      <Divider title="Customer Details" />
      <div className="flex max-sm:flex-col justify-between items-center w-full py-2">
        <p className="w-full">
          Name: {sale?.customer?.name || "Name not available"}
        </p>
        {sale?.customer?.phone && (
          <div className="w-full flex items-center gap-2">
            <p>Phone: {sale?.customer?.phone || "N/A"} </p>
          </div>
        )}
      </div>
      {sale?.customer?.email && (
        <p className="w-full">Email: {sale?.customer?.email}</p>
      )}

      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || !sale.products}
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
