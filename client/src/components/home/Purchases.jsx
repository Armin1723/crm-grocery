import React from 'react'
import { FaPlus, FaShoppingCart, FaWallet } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import RecentPurchase from '../purchases/RecentPurchase';
import ChipNav from '../utils/ChipNav';
import { MdOutlineKeyboardReturn } from 'react-icons/md';

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
    {
      label: "View Returns",
      icon: MdOutlineKeyboardReturn,
      to: "/purchases/returns",
    },
    {
      label: "Add Return",
      icon: FaPlus,
      to: "/purchases/returns/add",
    },
    {
      label: "View Expenses",
      icon: FaWallet,
      to: "/purchases/expenses",
    },
    {
      label: "Add Expense",
      icon: FaPlus,
      to: "/purchases/expenses/add",
    },
  ];
  return (
    <div className="flex-1 overflow-y-scroll md:overflow-y-hidden flex flex-col p-3 w-full">
      <ChipNav chips={chipData} baseUrl="/purchases" />
      <div className="flex-1 flex w-full flex-col md:flex-row gap-3 overflow-y-auto ">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
          <Outlet />
        </div>
        <RecentPurchase />
      </div>
    </div>
  );
};

export default Purchases
