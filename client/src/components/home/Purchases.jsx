import React from 'react'
import { FaPlus, FaShoppingCart } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import RecentPurchase from './purchases/RecentPurchase';
import ChipNav from '../utils/ChipNav';

const Purchases = () => {
  const chipData = [
    {
      label: "View Purchases",
      icon: FaShoppingCart,
      to: "/purchases",
    },
    {
      label: "Add Purchase",
      icon: FaPlus,
      to: "/purchases/add",
    },
  ];
  return (
    <div className="flex-1 overflow-y-scroll flex flex-col p-3 w-full">
      <ChipNav chips={chipData} baseUrl="/purchases" />
      <div className="flex-1 flex w-full max-sm:flex-col gap-3 max-h-full">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
          <Outlet />
        </div>
        <RecentPurchase />
      </div>
    </div>
  );
};

export default Purchases
