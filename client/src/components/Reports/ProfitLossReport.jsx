import React, { useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ReportHeader from "./ReportHeader";
import Divider from "../utils/Divider";
import PLData from "./PLData";
import CountUp from "react-countup";
import { getMonthName } from "../utils";
import { useReport } from "../../context/ReportContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import HelpTooltip from "../utils/HelpTooltip";
import { FaDownload } from "react-icons/fa";

const ProfitLossReport = () => {
  const printRef = useRef(null);

  const { dateRange } = useReport();

  const {
    data: reportData,
    isFetching: loading,
    error,
  } = useQuery({
    queryKey: [
      "plReport",
      { startDate: dateRange?.startDate, endDate: dateRange?.endDate },
    ],
    queryFn: async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/reports/profit-loss?startDate=${
          dateRange?.startDate
        }&endDate=${dateRange?.endDate}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        throw new Error(data.message);
      }
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const handleDownload = () => {
    const data = {
      ...reportData,
      startDate: dateRange?.startDate,
      endDate: dateRange?.endDate,
    }
    window.electron.ipcRenderer.send("print-pl-report", data);
  };

  return (
    <div className="w-full p-6 flex-1 max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg">
      <div className="mx-auto space-y-3 rounded-lg p-2 flex flex-col h-full overflow-y-auto">
        <ReportHeader title="P/L" printRef={printRef} handleDownload={null} />
        {loading ? (
          <div className="w-full p-6 min-h-fit max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 flex-1 flex flex-col items-center justify-center">
            {error.message || "Something went wrong."}
          </div>
        ) : (
          <div className="flex flex-col gap-2" ref={printRef}>
            <PLData reportData={reportData} />

            {/* Chart Section */}
            <div className="bg-[var(--color-card)] rounded-lg p-3 flex flex-col gap-3 shadow-sm">
              <Divider title="Monthly Trends" />

              {reportData?.charts?.salesChartData?.length === 0 ||
              reportData?.charts?.expenseChartData?.length === 0 ? (
                <p className="text-center text-[var(--color-text-light)]">
                  No data available for the selected date range
                </p>
              ) : (
                <div className="chart-grid flex flex-row flex-wrap capitalize items-center">
                  {/* Sales Chart */}
                  <div className="w-full md:w-1/2 text-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={reportData?.charts?.salesChartData || []}>
                        <XAxis
                          dataKey="month"
                          tickFormatter={(value) => getMonthName(value)}
                        />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--color-primary)",
                            borderRadius: "8px",
                            border: "none",
                            color: "var(--color-text)",
                            padding: "10px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="sales" barSize={40} fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Expense Chart */}
                  <div className="w-full md:w-1/2 text-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={reportData?.charts?.expenseChartData || []}
                      >
                        <XAxis
                          dataKey="month"
                          tickFormatter={(value) => getMonthName(value)}
                        />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--color-primary)",
                            borderRadius: "8px",
                            border: "none",
                            color: "var(--color-text)",
                            padding: "10px",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="purchase"
                          stackId="a"
                          barSize={40}
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="expense"
                          stackId="a"
                          barSize={40}
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Profit / Loss Section */}
            <div className="bg-[var(--color-card)] rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 ">
                <Divider title="Profit / Loss Overview" />
                <FaDownload
                  onClick={handleDownload}
                  className="cursor-pointer text-[var(--color-text-light)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 my-2">
                <div
                  className={`bg-[var(--color-primary)] p-3 rounded-lg ${
                    reportData?.grossProfit < 0
                      ? "bg-red-600/20"
                      : "bg-green-600/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm text-[var(--color-text-light)]">
                      Gross Profit/Loss
                    </h3>
                    <HelpTooltip
                      position="right"
                      message="Gross Profit = Net Sales - Net Purchases"
                    />
                  </div>

                  <CountUp
                    className={`text-lg lg:text-xl font-bold ${
                      reportData?.grossProfit < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                    end={reportData?.grossProfit}
                    duration={2}
                    separator=","
                    decimals={2}
                    prefix="₹"
                  />
                </div>

                <div
                  className={`bg-[var(--color-primary)] p-4 rounded-lg ${
                    reportData?.netProfit < 0
                      ? "bg-red-600/20"
                      : "bg-green-600/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm text-[var(--color-text-light)]">
                      Net Profit/Loss
                    </h3>
                    <HelpTooltip
                      position="right"
                      message="Net Profit = Gross Profit - Total Expenses"
                    />
                  </div>
                  <CountUp
                    className={`text-lg lg:text-xl font-bold ${
                      reportData?.netProfit < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                    end={reportData?.netProfit}
                    duration={2}
                    separator=","
                    decimals={2}
                    prefix="₹"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitLossReport;
