import React from "react";
import { Outlet } from "react-router-dom";
import ChipNav from "../../utils/ChipNav";
import { FaPlus, FaShoppingCart, FaWallet } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdOutlineKeyboardReturn } from "react-icons/md";

const SellerPurchases = () => {
  const user = useSelector((state) => state.user);
  const hidden = !user?.permissions?.includes("expenses") 

   const chipData = [
      {
        label: "View Purchases",
        icon: FaShoppingCart,
        to: "/seller/purchases",
      },
      {
        label: "Add Purchase",
        icon: FaPlus,
        to: "/seller/purchases/add",
      },
      {
        label: "View Returns",
        icon: MdOutlineKeyboardReturn,
        to: "/seller/purchases/returns",
      },
      {
        label: "Add Return",
        icon: FaPlus,
        to: "/seller/purchases/returns/add",
      },
      {
        label: "View Expenses",
        icon: FaWallet,
        to: "/seller/purchases/expenses",
        hidden: hidden,
      },
      {
        label: "Add Expense",
        icon: FaPlus,
        to: "/seller/purchases/expenses/add",
        hidden: hidden,
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

export default SellerPurchases;
