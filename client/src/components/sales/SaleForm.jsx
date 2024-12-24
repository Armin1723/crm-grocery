import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SaveReload from "../utils/SaveReload";
import ProductSuggestionSearch from "../utils/ProductSuggestionSearch";
import AddByBarcode from "./AddByBarcode";

const SaleForm = ({ setRefetch = () => {}, closeModal = () => {} }) => {
  const [products, setProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const [taxType, setTaxType] = useState("number");
  const [discountType, setDiscountType] = useState("number");

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
      customerMobile: "",
      products: [],
      subTotal: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
      paymentType: "cash",
    },
  });

  const subTotal = watch("subTotal", 0);
  const tax = watch("tax", 0);
  const discount = watch("discount", 0);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const calculateDiscTax = () => {
    let discount, tax;
    if(discountType === "percent"){
      discount = parseFloat(
        Number((Number(subTotal) * Number(getValues("discount"))) / 100).toFixed(1)
      );
    } else {
      discount = Number(getValues("discount"));
    }
    if(taxType === "percent"){
      tax = parseFloat(
        Number((Number(subTotal) * Number(getValues("tax"))) / 100).toFixed(1)  
      );
    } else {
      tax = Number(getValues("tax"));
    }
    return {discount, tax};
  };

  useEffect(() => {
    const calculatedSubTotal = products.reduce(
      (acc, curr) => acc + (curr.sellingRate * curr.quantity || 0),
      0
    );
    setValue("subTotal", calculatedSubTotal);
  }, [products, setValue]);

  useEffect(() => {
    const {discount, tax} = calculateDiscTax();
    const calculatedTotal =
      Number(subTotal) - Number(discount) + Number(tax);
    setValue("totalAmount", calculatedTotal);
  }, [subTotal, discount, discountType, tax, taxType]);

  const addSale = async (values) => {
    const id = toast.loading("Adding sale...");
    const {discount, tax} = calculateDiscTax(); 
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
            products: products,
            subTotal: values.subTotal,
            tax,
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
        setProducts([]);
        setRefetch((prev) => !prev);
        navigate(`/sales/${data.sale.transactionId}/invoice`);
      }
    } catch (error) {
      toast.update(id, {
        render: "Failed to add sale",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(addSale)}
        onKeyDown={handleKeyDown}
        className="flex flex-col gap-2 w-full flex-1 min-h-[50vh] max-h-[58vh] overflow-x-hidden"
      >
        {/* Products Section */}
        <div className="title flex justify-between">
          <p className="my-1 font-semibold text-lg max-sm:text-base">
            Products
          </p>

          <SaveReload
            products={products}
            setProducts={setProducts}
            name="saleData"
          />
        </div>

        {/* Add Product */}
        <div className="add-product flex items-center max-sm:space-y-1 w-full pr-2 flex-wrap relative justify-between">
          <ProductSuggestionSearch
            products={products}
            setProducts={setProducts}
            suggestedProducts={suggestedProducts}
            setSuggestedProducts={setSuggestedProducts}
            type="sale"
          />
          <AddByBarcode products={products} setProducts={setProducts}/>
        </div>
        <div className="table-wrapper flex relative max-h-[55vh] min-h-fit flex-1 my-2 overflow-x-scroll">
        {products.length > 0 ? (
          <div className="products-container overflow-x-scroll max-sm:px-2 table flex-col w-fit min-w-full max-sm:text-sm flex-1">
            <div className="th flex w-fit min-w-full flex-1 justify-between items-center gap-2 border border-neutral-500/50 bg-[var(--color-card)] rounded-t-md px-2 py-1 sticky top-0 ">
              <p className="w-[5%] min-w-[30px]">*</p>
              <p className="w-1/5 min-w-[100px]">Name</p>
              <p className="w-1/5 min-w-[100px]">Category</p>
              <p className="w-1/5 min-w-[50px]">Rate</p>
              <p className="w-1/5 min-w-[80px]">Quantity</p>
              <p className="w-1/5 min-w-[80px] flex justify-center">Price</p>
            </div>
            {products.map((product, index) => (
              <div
                key={index}
                className="tr min-w-full w-fit flex-1 px-2 py-3 gap-2 border-l border-r border-neutral-500/50 product-item flex justify-between items-center"
              >
                <button
                  type="button"
                  onClick={() =>
                    setProducts((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="w-[5%] min-w-[30px] text-red-500 hover:text-red-600 transition-all duration-300 ease-in"
                >
                  <IoCloseCircle />
                </button>
                <p className="w-1/5 min-w-[100px] flex-wrap flex-grow">
                  {product.name}
                </p>
                <p className="w-1/5 min-w-[100px]">{product.category}</p>
                <div className="w-1/5 min-w-[50px] flex items-center pr-2">
                  <input
                    type="number"
                    min={product.purchaseRate}
                    value={product.sellingRate}
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p, i) =>
                          i === index
                            ? { ...p, sellingRate: Number(e.target.value) }
                            : p
                        )
                      )
                    }
                    className={`w-1/2 outline-none border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] p-1`}
                  />
                  <span className="text-sm max-sm:text-xs">
                    ₹/{product.unit}
                  </span>
                </div>
                <div className="w-1/5 min-w-[80px]">
                  <input
                    type="number"
                    min="1"
                    step={
                      product.unit === "g" || product.unit === "ml" ? 0.1 : 1
                    }
                    max={product.maxQuantity}
                    placeholder="Quantity"
                    value={product.quantity}
                    className={`border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-20 ${
                      product.quantity <= product.maxQuantity
                        ? ""
                        : "text-red-500"
                    }`}
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p, i) =>
                          i === index
                            ? {
                                ...p,
                                quantity: Number(e.target.value),
                                price: e.target.value
                                  ? parseFloat(
                                      Number(
                                        Number(p.sellingRate) *
                                          Number(e.target.value)
                                      ).toFixed(2)
                                    )
                                  : 0,
                              }
                            : p
                        )
                      )
                    }
                  />
                </div>
                <div className="w-1/5 min-w-[80px] flex justify-end">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Price"
                    value={product.sellingRate * product.quantity}
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p, i) =>
                          i === index
                            ? {
                                ...p,
                                price: Number(e.target.value),
                              }
                            : p
                        )
                      )
                    }
                    className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-20"
                  />
                </div>
              </div>
            ))}

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
                  <span>Taxes: </span>
                </div>
                <input
                  type="number"
                  min="0"
                  className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                  {...register("tax")}
                />
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setTaxType((p) => (p === "number" ? "percent" : "number"))
                  }
                >
                  {taxType === "number" ? <p>₹</p> : <p>%</p>}
                </div>
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
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setDiscountType((p) =>
                      p === "number" ? "percent" : "number"
                    )
                  }
                >
                  {discountType === "number" ? <p>₹</p> : <p>%</p>}
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
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full min-h-[25vh] flex-1 my-1 bg-[var(--color-card)] rounded-md border border-neutral-500/50">
            <p className="text-lg text-neutral-500">No products added</p>
          </div>
        )}
        </div>

        {/* Customer Section */}
        <div className="flex flex-col w-full">
          <p className="my-1 font-semibold text-lg max-sm:text-base">
            Customer
          </p>
          <input
            type="number"
            placeholder="Enter Customer Number"
            className="outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer "
            {...register("customerMobile")}
          />
        </div>

        {/* Payment Details */}
        <div className="flex flex-col w-full">
          <p className="my-1 font-semibold text-lg max-sm:text-base">
            Payment details
          </p>
          <select
            {...register("paymentType")}
            className="outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer "
          >
            <option className="bg-[var(--color-card)]" value="cash">
              Cash
            </option>
            <option className="bg-[var(--color-card)]" value="card">
              Card
            </option>
            <option className="bg-[var(--color-card)]" value="upi">
              UPI
            </option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={products.length === 0}
          className="px-3 py-1.5 my-2 capitalize rounded-md disabled:cursor-not-allowed disabled:hover-none bg-accent hover:bg-accentDark text-white"
        >
          Add Sale
        </button>
      </form>
    </div>
  );
};

export default SaleForm;
