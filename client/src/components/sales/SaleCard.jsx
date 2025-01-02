import React from "react";
import { formatDate } from "../utils";

const SaleCard = ({ sale }) => {
  return (
    <div className="p-6 w-full rounded-lg shadow-lg bg-[var(--color-card)] text-[var(--color-text)]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sales Summary</h2>
        <div className="text-sm px-3 py-1 rounded-full bg-[var(--color-accent)] text-white">
          {formatDate(sale?.createdAt) || "Today"}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

      <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-[var(--color-sidebar)]">
          <span className="text-xl font-bold ">
            {sale?.totalAmount.toLocaleString() || "0"}₹
          </span>
          <p className="text-sm text-[var(--color-text-light)]">Total Amount</p>
        </div>

        {/* Individual Stat */}
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-[var(--color-sidebar)]">
          <span className="text-xl font-bold ">
            {sale?.products?.length || "0"}
          </span>
          <p className="text-sm text-[var(--color-text-light)]">
            Products
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-[var(--color-sidebar)]">
          <span className="text-xl font-bold ">
            {sale?.customer?.name || sale?.customer?.phone || "N/A"}
          </span>
          <p className="text-sm text-[var(--color-text-light)]">
            Customer
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-[var(--color-sidebar)]">
          <span className="text-xl font-bold ">
            {sale?.signedBy?.name || "N/A"}
          </span>
          <p className="text-sm text-[var(--color-text-light)]">
            Biller
          </p>
        </div>
      </div>

    </div>
  );
};

export default SaleCard;
