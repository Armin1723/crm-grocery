import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Divider from "../utils/Divider";
import Avatar from "../utils/Avatar";
import SaleCard from "./SaleCard";
import EmployeeCard from "../employee/EmployeeCard";
import SaleReturnCard from "./SaleReturnCard";
import { pluralizeWord } from "../utils";
import SaleDetailActions from "./SaleDetailActions";
import SubscriptionOverlay from "../utils/SubscriptionOverlay";

const SaleDetails = ({ idBackup = "", previewOnly = false }) => {
  let { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refetch, setRefetch] = useState(false);

  if (idBackup) id = idBackup;

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 403) {
            setError({
              subscription: "expired",
              message: "Your subscription has expired. Please renew.",
            });
          } else {
            setError(data.message || "Something went wrong");
          }
          throw new Error(data.message || "Something went wrong");
        }
        setSale(data.sale);
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
      <div className="p-3 rounded-md flex h-full flex-col items-center justify-center gap-2 min-h-[40vh] min-w-[30vw] bg-[var(--color-sidebar)] w-full">
        <div className="spinner "></div>
      </div>
    );
  else if (error && !error.subscription) {
    return (
      <div className="p-3 rounded-md flex h-full flex-col items-center justify-center gap-2 min-h-[40vh] bg-[var(--color-sidebar)] w-full">
        <p className="text-red-500">
          {error.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-md flex h-full flex-1 flex-col gap-2 bg-[var(--color-sidebar)] overflow-y-auto">
      <div className="top flex w-full justify-between flex-wrap my-2">
        <div className="top-left title flex items-center gap-2 flex-wrap ">
          <p className="text-xl max-lg:text-lg font-bold ">Sale Details </p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => setRefetch((p) => !p)}
          ></p>
        </div>
        {!previewOnly && <SaleDetailActions sale={sale} />}
      </div>

      {error && error.subscription ? (
        <SubscriptionOverlay />
      ) : (
        <div className="wrapper flex-1 overflow-y-auto px-2">
          <div className="text-sm text-[var(--color-text-light)] flex items-center gap-1">
            <p>Invoice ID: {sale?._id}</p>
            {sale?.deficitAmount > 0 && (
              <span className="text-red-500 bg-red-500/10 border border-red-500 px-2 rounded-md text-xs">
                Unpaid
              </span>
            )}
          </div>

          {/* Sale Products */}
          <Divider title="Sale Products" />
          <div className="saleProducts flex flex-col gap-2 w-full rounded-md p-3 bg-[var(--color-card)] overflow-x-auto">
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
                {sale?.products.map((product) => (
                  <tr
                    key={product?._id}
                    className="border-b border-neutral-500/50"
                  >
                    <td className="py-2 pl-4">
                      <Avatar
                        image={product?.image}
                        withBorder={false}
                        fallbackImage="./utils/product-placeholder.png"
                      />
                    </td>
                    <td className="py-2 pl-4">{product.name}</td>
                    <td className="py-2 pl-4">
                      {product.quantity}{" "}
                      {pluralizeWord(product.quantity, product.secondaryUnit)}
                    </td>
                    <td className="py-2 pl-4">₹{product.sellingRate}</td>
                    <td className="py-2 pl-4">
                      ₹{Math.ceil(product.sellingRate * product.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col text-sm items-end pr-4">
              <div className="total flex justify-end items-center gap-4">
                <p className="">Total:</p>
                <p className="">₹{Math.ceil(sale?.totalAmount)}</p>
              </div>
              {sale?.deficitAmount > 0 && (
                <>
                  <div className="paidAmount flex justify-end items-center gap-4">
                    <p className="">Paid Amount:</p>
                    <p className="">₹{Math.ceil(sale?.paidAmount)}</p>
                  </div>
                  <div className="deficit flex justify-end items-center gap-4">
                    <p className="">Balance:</p>
                    <p className="">₹{Math.ceil(sale?.deficitAmount)}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sale Information */}
          <Divider title="Sale Summary" />
          <SaleCard sale={sale} />

          { /* Sale Description */}
          {sale?.description && (
            <>
              <Divider title="Sale Description" />
              <div className="description bg-[var(--color-card)] p-3 rounded-md">
                <p className="text-sm text-[var(--color-text-light)] capitalize">{sale?.description}</p>
              </div>
            </>
          )}

          {/* Biller Information */}
          <Divider title="Biller Information" />
          <EmployeeCard employee={sale?.signedBy} />

          {/* Return Information */}
          {sale?.saleReturn && (
            <>
              <Divider title="Return Information" />
              <SaleReturnCard saleReturn={sale?.saleReturn} previewOnly={previewOnly} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SaleDetails;
