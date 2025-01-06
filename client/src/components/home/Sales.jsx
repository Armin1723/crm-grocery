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
      to: "/sales/returns"
    },
    {
      label: "Add Return",
      icon: FaPlus,
      to: "/sales/add-return",
    }
  ];
  return (
    <div className="flex-1 overflow-y-scroll md:overflow-y-hidden flex flex-col p-3 w-full">
      <ChipNav chips={chipData} baseUrl="/sales" />
      <div className="flex-1 flex w-full flex-col md:flex-row gap-3 overflow-y-auto">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
                  <Outlet />
                </div>
        <RecentSale />
      </div>
    </div>
  );
};

export default Purchases;
