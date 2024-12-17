import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SaleForm = ({ setRefetch = () => {}, closeModal = () => {} }) => {
  const [products, setProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const [taxType, setTaxType] = useState("number");

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
    },
  });

  const subTotal = watch("subTotal", 0);
  const tax = watch("tax", 0);
  const discount = watch("discount", 0);

  useEffect(() => {
    const calculatedSubTotal = products.reduce(
      (acc, curr) => acc + (curr.sellingRate * curr.quantity || 0),
      0
    );
    setValue("subTotal", calculatedSubTotal);
  }, [products, setValue]);

  useEffect(() => {
    let calculatedTax = 0;
    if(taxType === "percent") {
      calculatedTax = (Number(subTotal) * Number(tax)) / 100;
    }else{
      calculatedTax = Number(tax);
    }
    const calculatedTotal = Number(subTotal) - Number(discount) + calculatedTax;
    setValue("totalAmount", calculatedTotal);
  }, [subTotal, discount, tax, taxType, setValue]);

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

  const addSale = async (values) => {
    const id = toast.loading("Adding sale...");
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
            tax: taxType === 'number' ? values.tax : ((values.tax * values.subTotal) / 100),  
            discount: values.discount,
            totalAmount: values.totalAmount,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
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
        navigate("/sales");
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
        className="flex flex-col gap-2 w-full flex-1 min-h-[50vh] max-h-[58vh] overflow-x-hidden"
      >
        {/* Products Section */}
        <p className="my-1 font-semibold text-lg max-sm:text-base">Products</p>
        {/* Add Product */}
        <div className="flex items-end w-fit justify-end relative">
          <div className="top flex items-center gap-2">
            <div className="searchBar flex items-center border border-neutral-500 rounded-md">
              <div className="h-full rounded-s-md px-3 py-2 bg-[var(--color-card)]">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search for product"
                className="bg-transparent outline-none pl-2 rounded-md p-1"
                onChange={fetchSuggestedProducts}
              />
            </div>
          </div>
          {suggestedProducts.length > 0 && (
            <div className="suggested-products w-full absolute top-full left-0 z-[99] bg-[var(--color-card)] rounded-md shadow-md border border-neutral-500/50">
              {suggestedProducts.map((product) => (
                <div
                  key={product._id}
                  className="supplier-option px-3 py-2 text-sm hover:bg-accentDark/20 transition-all duration-300 ease-in cursor-pointer"
                  onClick={() => {
                    setProducts((prev) => [
                      ...prev,
                      {
                        _id: product._id,
                        name: product.name,
                        category: product.category,
                        unit: product.unit,
                        quantity: 1,
                        purchaseRate: 0,
                        sellingRate: product.rate,
                        price: product.price || 0,
                      },
                    ]);
                    setSuggestedProducts([]);
                  }}
                >
                  {product.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {products.length > 0 ? (
          <div className="products-container overflow-x-scroll max-sm:px-2 table flex-col w-fit min-w-full max-sm:text-sm flex-1">
            <div className="th flex w-fit min-w-full flex-1 justify-between items-center gap-2 border border-neutral-500/50 bg-[var(--color-card)] rounded-t-md px-2 py-1 sticky top-0 ">
              <p className="w-[5%] min-w-[30px]">*</p>
              <p className="w-1/5 min-w-[100px]">Name</p>
              <p className="w-1/5 min-w-[100px]">Category</p>
              <p className="w-1/5 min-w-[50px]">MRP</p>
              <p className="w-1/5 min-w-[150px]">Purchase Rate</p>
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
                <input
                  type="number"
                  min="0"
                  step="0.1"
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
                  className={`w-1/5 min-w-[50px] ${
                    product.sellingRate &&
                    product.sellingRate <= product.purchaseRate &&
                    "text-red-600"
                  } outline-none border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] p-1`}
                />
                <p className="w-1/5 min-w-[150px]">
                  ₹{product.purchaseRate}
                  <span className="text-sm max-sm:text-xs">
                    /{product.unit}
                  </span>
                </p>
                <div className="w-1/5 min-w-[80px]">
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={product.quantity}
                    className="border-b placeholder:text-sm bg-transparent border-[var(--color-accent)] outline-none p-1 w-20 "
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
                                        Number(p.price) / Number(e.target.value)
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
                                          Number(p.quantity)
                                      ).toFixed(2)
                                    )
                                  : 0,
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
              <p className="text-right">
                Sub Total:{" "}
                <input
                  type="number"
                  readOnly
                  className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                  {...register("subTotal")}
                />
                ₹
              </p>
              <p className="text-right flex">
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
              </p>
              <p className="text-right">
                Discount:{" "}
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="border-b placeholder:text-sm bg-transparent text-right border-[var(--color-accent)] outline-none p-1 w-20"
                  {...register("discount")}
                />
                ₹
              </p>
              <p className="text-right">
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
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full min-h-[35vh] flex-1 my-1 bg-[var(--color-card)] rounded-md border border-neutral-500/50">
            <p className="text-lg text-neutral-500">No products added</p>
          </div>
        )}

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
