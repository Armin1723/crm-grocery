import React from "react";
import { FaChartLine, FaPlus } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import ChipNav from "../utils/ChipNav";
import RecentSale from "../sales/RecentSale";
import { MdOutlineKeyboardReturn } from "react-icons/md";

const Purchases = () => {
  const chipData = [
    {
      label: "View Sales",
      icon: FaChartLine,
      to: "/sales",
    },
    {
      label: "Add Sales",
      icon: FaPlus,
      to: "/sales/add",
    },
    {
      label: "View Returns",
      icon: MdOutlineKeyboardReturn,
      to: "/sales/returns",
    },
    {
      label: "Add Return",
      icon: FaPlus,
      to: "/sales/returns/add",
    },
  ];
  return (
    <div className="flex-1 overflow-y-auto min-h-full flex flex-col p-3 w-full">
      <ChipNav chips={chipData} baseUrl="/sales" />
      <div className="flex-1 flex w-full flex-col lg:flex-row gap-3 overflow-y-auto">
        <Outlet />
        <RecentSale />
      </div>
    </div>
  );
};

export default Purchases;
