import React, { useState } from "react";
import Divider from "../utils/Divider";
import { toast } from "react-toastify";
import SaleReturnForm from "./SaleReturnForm";

const SaleReturn = () => {
  const [invoiceId, setInvoiceId] = useState("");
  const [sale, setSale] = useState({});
  const [loading, setLoading] = useState(false);

  const getSale = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/${invoiceId}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "No Such Sale Found.");
      }
      setSale(data.sale);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-3 h-full w-full flex-1 rounded-md flex flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="title flex items-center gap-2 my-2 w-full">
        <p className="text-xl max-lg:text-lg font-bold px-2 ">Sales Return</p>
      </div>

      <div className="container flex flex-col w-full flex-1 overflow-y-auto px-2">
        <div className="salesInfo flex flex-col gap-2 w-full">
          <Divider title="Sale ID" />
          <div className="w-full flex items-center gap-2">
            <div className="invoice-id-input flex-1 flex flex-col relative group my-2">
              <input
                type="text"
                placeholder=" "
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className={`input peer`}
                name="invoice"
              />
              <label
                htmlFor="invoice"
                className={`input-label peer-focus:text-[var(--color-accent-dark)] `}
              >
                Invoice ID
              </label>
            </div>
            <button
              disabled={!invoiceId}
              onClick={getSale}
              className="bg-accent px-3 py-1 rounded-md text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>
        </div>

        <div className="productsInfo w-full flex flex-col">
          <Divider title="Products Details" />
          <SaleReturnForm sale={sale} setSale={setSale} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default SaleReturn;
