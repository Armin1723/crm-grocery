import React from 'react'
import { FaChartLine, FaPlus } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import ChipNav from '../utils/ChipNav';
import RecentSale from '../sales/RecentSale';

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
  ];
  return (
    <div className="flex-1 overflow-y-scroll flex flex-col p-3 w-full">
      <ChipNav chips={chipData} baseUrl="/sales" />
      <div className="flex-1 flex w-full max-sm:flex-col gap-3 max-h-full">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
          <Outlet />
        </div>
        <RecentSale />
      </div>
    </div>
  );
};

export default Purchases