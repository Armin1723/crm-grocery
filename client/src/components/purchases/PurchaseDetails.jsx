import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Divider from "../utils/Divider";
import { AiFillCheckCircle, AiFillWarning } from "react-icons/ai";
import Avatar from "../utils/Avatar";
import PurchaseDetailActions from "./PurchaseDetailActions";
import SupplierCard from "../suppliers/SupplierCard";
import PurchaseReturnCard from "./PurchaseReturnCard";
import { pluralizeWord } from "../utils";

const PurchaseDetails = ({ idBackup = "" }) => {
  let { id } = useParams();

  if (!id) id = idBackup;
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
              <div className="flex items-center gap-3 capitalize text-xs">
                <div
                  className={`status-icon flex items-center px-3 py-1 rounded-lg ${
                    purchase?.deficitAmount === 0
                      ? "bg-green-100 border-green-400"
                      : "bg-red-100 border-red-400"
                  }`}
                >
                  {purchase?.deficitAmount === 0 ? (
                    <AiFillCheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <AiFillWarning className="w-3 h-3 text-amber-500 mr-1" />
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
                {purchase?.return && (
                  <div className=" text-red-500 bg-red-100 rounded-lg border-red-400 px-3 py-1">
                    returned
                  </div>
                )}
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
                  <td className="py-2 pl-4">{product?.product?.name}</td>
                  <td className="py-2 pl-4">
                    {product.quantity} {pluralizeWord(product.quantity, product?.product?.secondaryUnit)}
                  </td>
                  <td className="py-2 pl-4">₹{product?.purchaseRate}</td>
                  <td className="py-2 pl-4">
                    ₹{Math.ceil(product?.purchaseRate * product?.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="totalAmount flex justify-end items-center gap-2">
            <p className="">Total Amount:</p>
            <p className="">₹{Math.ceil(purchase?.totalAmount)}</p>
          </div>
        </div>

        {/* Supplier Information */}
        <Divider title="Supplier Information" />
        <SupplierCard supplier={purchase?.supplier} />

        {/* Return Information */}
        {purchase?.return && (
          <div className="flex flex-col gap-2 my-2">
            <Divider title="Return Information" />
            <PurchaseReturnCard purchaseReturn={purchase?.return} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseDetails;
