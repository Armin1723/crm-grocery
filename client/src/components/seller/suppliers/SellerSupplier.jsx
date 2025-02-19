import React from "react";
import { Outlet } from "react-router-dom";
import ChipNav from "../../utils/ChipNav";
import { FaPlus, FaStore } from "react-icons/fa";

const SellerSuppliers = () => {

   const chipData = [
      {
        label: "View Suppliers",
        icon: FaStore,
        to: "/seller/suppliers",
      },
      {
        label: "Add Supplier",
        icon: FaPlus,
        to: "/seller/suppliers/add",
      },
    ];
  return (
    <div className="flex flex-col rounded-md bg-[var(--color-sidebar)] select-none p-2 flex-1 w-full h-full gap-3 overflow-y-hidden">
      <ChipNav chips={chipData} baseUrl="/seller" />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerSuppliers;
