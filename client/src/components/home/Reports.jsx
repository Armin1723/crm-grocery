import React from "react";
import ChipNav from "../utils/ChipNav";
import { Outlet } from "react-router-dom";
import { BiReceipt } from "react-icons/bi";

const Reports = () => {
  const navData = [
    {
      label: "Expense",
      icon: BiReceipt,
      to: "/reports",
    },
  ];
  return (
    <div className="flex-1 max-sm:overflow-y-auto flex flex-col p-3 w-full">
      <ChipNav chips={navData} baseUrl="/reports" />
      <div className="flex-1 flex w-full max-lg:flex-col gap-3 ">
          <Outlet />
      </div>
    </div>
  );
};

export default Reports;
