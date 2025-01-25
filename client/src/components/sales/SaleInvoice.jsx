import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SaleInvoice = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState(null);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setSale(data.sale);
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
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
          <p className="text-xl max-lg:text-lg font-bold ">Sale Invoice </p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => setRefetch((p) => !p)}
          ></p>
        </div>
      </div>

      <embed
        type="application/pdf"
        src={sale?.invoice}
        width="100%"
        className="flex-1"
      />
    </div>
  );
};

export default SaleInvoice;
