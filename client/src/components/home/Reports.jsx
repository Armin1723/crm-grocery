import React from "react";
import ChipNav from "../utils/ChipNav";
import { Outlet } from "react-router-dom";
import { BiReceipt } from "react-icons/bi";
import {
  FaBalanceScale,
  FaChartLine,
  FaFileInvoiceDollar,
  FaReceipt,
} from "react-icons/fa";
import { ReportProvider } from "../../context/ReportContext";
import { useSelector } from "react-redux";

const Reports = () => {
  const user = useSelector((state) => state.user);

  const baseUrl = user?.role === 'admin' ? '' : '/seller';

  const navData = [
    {
      label: "Expense",
      icon: BiReceipt,
      to: `${baseUrl}/reports`,
    },
    {
      label: "Sales",
      icon: FaChartLine,
      to: `${baseUrl}/reports/sales`,
    },
    {
      label: "Tax",
      icon: FaFileInvoiceDollar,
      to: `${baseUrl}/reports/tax`,
    },
    {
      label: "Profit/Loss",
      icon: FaBalanceScale,
      to: `${baseUrl}/reports/profit-loss`,
    },
    {
      label: "Balances",
      icon: FaReceipt,
      to: `${baseUrl}/reports/balances`,
    }
  ];

  return (
    <ReportProvider>
      <div className="flex-1 h-full max-sm:overflow-y-auto flex flex-col p-3 w-full">
        <ChipNav chips={navData} baseUrl="/reports" />
        <div className="flex-1 flex w-full border border-neutral-500/50 rounded-md overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </ReportProvider>
  );
};

export default Reports;
