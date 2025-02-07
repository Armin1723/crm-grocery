import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Divider from "../utils/Divider";
import SupplierCard from "./SupplierCard";
import SupplierPurchaseTable from "./SupplierPurchaseTable";
import SupplierProductCarousel from "./SupplierProductCarousel";
import { toast } from "react-toastify";

const SupplierDetails = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/suppliers/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Something went wrong");
          setError(data.message || "Something went wrong");
          throw new Error(data.message || "Something went wrong");
        }
        setSupplier(data.supplier);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id, refetch]);

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-4 border border-neutral-500/50 bg-[var(--color-sidebar)] overflow-y-auto w-full">
      <div className="top flex w-full justify-between flex-wrap my-2">
        <div className="top-left title flex items-center gap-2 flex-wrap">
          <p className="text-xl max-lg:text-lg font-bold">Supplier Details</p>
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
        <div className="flex-1 space-y-6 overflow-y-auto px-2 w-full flex flex-col items-center justify-center text-red-600">
          {error?.message || "Something went wrong."}
        </div>
      ) : (
        <div className="wrapper flex-1 space-y-6 overflow-y-auto px-2 w-full">
          {/* Supplier Card */}
          <SupplierCard supplier={supplier} setRefetch={setRefetch} />

          {/* Purchase History */}
          <div className="space-y-3">
            <Divider title="Purchase History" />
            <SupplierPurchaseTable />
          </div>

          {/* Products */}
          <div className="space-y-3 w-full">
            <Divider title="Products History" />
            <SupplierProductCarousel />
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDetails;
