import React from "react";
import { Outlet } from "react-router-dom";
import ChipNav from "../../utils/ChipNav";
import { FaPlus, FaUser } from "react-icons/fa";

const SellerCustomers = () => {

   const chipData = [
      {
        label: "View Customers",
        icon: FaUser,
        to: "/seller/customers",
      },
      {
        label: "Add Customer",
        icon: FaPlus,
        to: "/seller/customers/add",
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

export default SellerCustomers;
