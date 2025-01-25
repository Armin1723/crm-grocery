import React from "react";
import { Outlet } from "react-router-dom";
import ChipNav from "../../utils/ChipNav";
import { FaList } from "react-icons/fa";
import { BsInboxesFill } from "react-icons/bs";

const SellerInventory = () => {
  const chipData = [
    {
      label: "View Inventory",
      to: "/seller/inventory",
      icon: FaList,
    },
    {
      label: "Inventory Grid",
      to: "/seller/inventory/grid",
      icon: BsInboxesFill,
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

export default SellerInventory;
