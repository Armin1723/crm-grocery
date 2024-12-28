import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Divider from "../utils/Divider";
import { FaStore } from "react-icons/fa";
import { AiFillCheckCircle, AiFillWarning } from "react-icons/ai";
import Avatar from "../utils/Avatar";
import PurchaseDetailActions from "./PurchaseDetailActions";

const PurchaseDetails = () => {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/purchases/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPurchase(data.purchase);
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchase();
  }, [id, refetch]);

  if (loading)
    return (
      <div className="p-3 rounded-md flex h-full flex-col items-center justify-center gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)] ">
        <div className="spinner "></div>
      </div>
    );

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)] overflow-y-auto">
      <div className="top flex w-full justify-between flex-wrap my-2">
        <div className="top-left title flex items-center gap-2 flex-wrap ">
          <p className="text-xl max-lg:text-lg font-bold ">Purchase Details </p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => setRefetch((p) => !p)}
          ></p>
        </div>
        <PurchaseDetailActions purchase={purchase} />
      </div>

      <div className="wrapper flex-1 max-h-[58vh] overflow-y-auto px-2">
        {/* Purchase Information */}
        <Divider title="Purchase Information" />
        <div className="purchaseInfo flex flex-col gap-2 w-full rounded-md p-3 bg-[var(--color-card)] min-h-fit overflow-hidden">
          <div className="bg-[var(--color-primary)] border border-neutral-500/50 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl max-lg:text-lg max-sm:text-base font-bold">
                Payment Details
              </h2>
              <div className="flex items-center">
                {purchase?.deficitAmount === 0 ? (
                  <AiFillCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <AiFillWarning className="w-5 h-5 text-amber-500 mr-2" />
                )}
                <span
                  className={`font-semibold ${
                    purchase?.deficitAmount === 0
                      ? "text-green-500"
                      : "text-amber-500"
                  }`}
                >
                  {purchase?.deficitAmount === 0 ? "Paid" : "Pending"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-[var(--color-card)] p-4 rounded-lg flex flex-col justify-between">
                <div className="text-neutral-500 mb-1">Total Amount</div>
                <div className="text-lg font-bold">
                  ₹{purchase?.totalAmount}
                </div>
              </div>
              <div className="bg-[var(--color-card)] p-4 rounded-lg flex flex-col justify-between">
                <div className="text-neutral-500 mb-1">Total Paid</div>
                <div className="text-lg font-bold text-green-600">
                  ₹{purchase?.totalAmount - purchase?.deficitAmount}
                </div>
              </div>
              <div className="bg-[var(--color-card)] p-4 rounded-lg flex flex-col justify-between">
                <div className="text-neutral-500 mb-1">Remaining Balance</div>
                <div className="text-lg font-bold text-amber-600">
                  ₹{Math.max(0, purchase?.deficitAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Products */}
        <Divider title="Purchase Products" />
        <div className="purchaseProducts flex flex-col gap-2 w-full rounded-md p-3 bg-[var(--color-card)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-primary)] text-neutral-600">
              <tr>
                <th className="py-2 text-left pl-4">Image</th>
                <th className="py-2 text-left pl-4">Product</th>
                <th className="py-2 text-left pl-4">Quantity</th>
                <th className="py-2 text-left pl-4">Price</th>
                <th className="py-2 text-left pl-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {purchase?.products.map((product) => (
                <tr key={product._id} className="border-b border-neutral-500">
                  <td className="py-2 pl-4">
                    <Avatar
                      image={product.product.image}
                      withBorder={false}
                      fallbackImage="/utils/product-placeholder.png"
                    />
                  </td>
                  <td className="py-2 pl-4">{product.product.name}</td>
                  <td className="py-2 pl-4">
                    {product.quantity} {product.product.secondaryUnit}
                  </td>
                  <td className="py-2 pl-4">₹{product.purchaseRate}</td>
                  <td className="py-2 pl-4">
                    ₹{product.purchaseRate * product.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="totalAmount flex justify-end items-center gap-2">
            <p className="">Total Amount:</p>
            <p className="">₹{purchase?.totalAmount}</p>
          </div>
        </div>

        {/* Supplier Information */}
        <Divider title="Supplier Information" />
        <div className="supplierInfo flex flex-col gap-2 w-full rounded-md p-3 bg-[var(--color-card)]">
          <div className="flex max-sm:flex-col items-center gap-4 max-sm:gap-2 w-full ">
            <FaStore className="text-6xl aspect-square text-accent/70 items-left" />
            <div className="details flex max-sm:w-full flex-1 justify-between items-center">
              <div className="details-left flex flex-col">
                <Link
                  to={`/suppliers/${purchase?.supplier?._id}`}
                  className="text-xl font-bold"
                >
                  {purchase?.supplier?.name}
                </Link>
                <p>{purchase?.supplier?.email}</p>
                <p>{purchase?.supplier?.phone}</p>
              </div>
              <div className="balance px-3 py-1 rounded-md bg-accent/70 text-white font-semibold flex items-center justify-center h-fit gap-2">
                <p className="">Balance: </p>
                <p
                  className={`${
                    purchase?.supplier?.balance < 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {purchase?.supplier?.balance}
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PurchaseDetails;
