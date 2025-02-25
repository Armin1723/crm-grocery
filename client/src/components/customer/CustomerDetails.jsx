import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Divider from "../utils/Divider";
import CustomerCard from "./CustomerCard";
import SubscriptionOverlay from "../utils/SubscriptionOverlay";
import CustomerSales from "./CustomerSales";
import CustomerProducts from "./CustomerProducts";

const CustomerDetails = () => {
  const { id } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [refetch, setRefetch] = React.useState(false);
  const [customer, setCustomer] = React.useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/customers/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 403) {
            setError({
              subscription: "Expired",
              message:
                data.message || "Your subscription has expired. Please renew",
            });
          } else {
            setError({ message: data.message || "Something went wrong" });
            throw new Error(data.message || "Something went wrong");
          }
        }
        setCustomer(data.customer);
      } catch (error) {
        console.error("Error fetching customer:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, refetch]);

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-4 border border-neutral-500/50 bg-[var(--color-sidebar)] overflow-y-auto w-full">
      <div className="top flex w-full justify-between flex-wrap my-2">
        <div className="top-left title flex items-center gap-2 flex-wrap">
          <p className="text-xl max-lg:text-lg font-bold">Customer Details</p>
          <div
            className={` ${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => setRefetch((p) => !p)}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex-1 space-y-6 overflow-y-auto px-2 w-full flex flex-col items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        error?.subscription ? (
          <SubscriptionOverlay />
        ) : (
          <div className="flex-1 space-y-6 overflow-y-auto px-2 w-full flex flex-col items-center justify-center text-red-600">
            {error?.message || "Something went wrong."}
          </div>
        )
      ) : (
        <div className="wrapper flex-1 space-y-6 overflow-y-auto px-2 w-full">
          <CustomerCard customer={customer} loading={loading} />
          <Divider title="Customer Sales" />
          <CustomerSales />
          <>
            <Divider title="Customer Products" />
            <CustomerProducts />
          </>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
