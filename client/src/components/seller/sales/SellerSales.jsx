import React from "react";
import { Outlet } from "react-router-dom";
import ChipNav from "../../utils/ChipNav";
import { FaChartLine, FaPlus } from "react-icons/fa";

const SellerSales = () => {
  const chipData = [
    {
      label: "View Sales",
      to: "/seller/sales",
      icon: FaChartLine,
    },
    {
      label: "Add Sale",
      to: "/seller/sales/add",
      icon: FaPlus,
    },
  ];
  return (
    <div className="rounded-md bg-[var(--color-sidebar)] select-none p-2 flex-1 flex flex-col w-full h-full gap-3 overflow-x-hidden">
      <ChipNav chips={chipData} baseUrl="/seller" />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerSales;
