import React from "react";
import ChipNav from "../utils/ChipNav";
import { FaPlus, FaWallet } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const Expenses = () => {
  const navData = [
    {
        label: "View Expenses",
        icon: FaWallet,
        to: "/expenses",
      },
      {
        label: "Add Expense",
        icon: FaPlus,
        to: "/expenses/add",
      },
  ];
  return (
    <div className="flex-1 overflow-y-scroll flex flex-col p-3 w-full">
      <ChipNav chips={navData} baseUrl="/expenses" />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
    </div>
  );
};

export default Expenses;