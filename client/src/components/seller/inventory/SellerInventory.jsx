import React from "react";
import ChipNav from "../../utils/ChipNav";
import { FaList } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { BsInboxesFill } from "react-icons/bs";

const SellerInventory = () => {
  const chipData = [
    {
      label: "Inventory List",
      icon: FaList,
      to: "/seller/inventory",
    },
    {
      label: "Inventory Grid",
      icon: BsInboxesFill,
      to: "/seller/inventory/grid",
    },
  ];
  return (
    <div className="flex flex-col rounded-md bg-[var(--color-sidebar)] select-none p-2 border border-neutral-500/50 flex-1 w-full h-full gap-3 overflow-y-auto">
      <ChipNav chips={chipData} baseUrl="/seller/inventory" />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerInventory;
