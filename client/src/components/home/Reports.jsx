import React from "react";
import ChipNav from "../utils/ChipNav";
import { Outlet } from "react-router-dom";
import { BiReceipt } from "react-icons/bi";
import {
  FaBalanceScale,
  FaChartLine,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { ReportProvider } from "../../context/ReportContext";

const Reports = () => {
  const navData = [
    {
      label: "Expense",
      icon: BiReceipt,
      to: "/reports",
    },
    {
      label: "Sales",
      icon: FaChartLine,
      to: "/reports/sales",
    },
    {
      label: "Tax",
      icon: FaFileInvoiceDollar,
      to: "/reports/tax",
    },
    {
      label: "Profit/Loss",
      icon: FaBalanceScale,
      to: "/reports/profit-loss",
    },
  ];
  return (
    <ReportProvider>
      <div className="flex-1 max-sm:overflow-y-auto flex flex-col p-3 w-full">
        <ChipNav chips={navData} baseUrl="/reports" />
        <div className="flex-1 flex w-full max-lg:flex-col gap-3 ">
          <Outlet />
        </div>
      </div>
    </ReportProvider>
  );
};

export default Reports;
