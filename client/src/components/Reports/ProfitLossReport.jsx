import React, { useEffect, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
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

const ProfitLossReport = () => {
  const printRef = useRef(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    const fetchPLReport = async () => {
      setLoading(true);
      // Fetch data for the report
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/reports/profit-loss?startDate=${
            dateRange?.startDate
          }&endDate=${dateRange?.endDate}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch data");
        } else {
          setReportData(data);
        }
      } catch (error) {
        console.error("Error fetching profit/loss report data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPLReport();
  }, [dateRange]);

  const handleDownload = () => {};

  return (
    <div
      className="w-full p-6 min-h-fit max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg "
      ref={printRef}
    >
      <div className="max-w-7xl mx-auto space-y-3 rounded-lg p-4 border border-neutral-500/50">
        <ReportHeader
          title="P/L"
          dateRange={dateRange}
          setDateRange={setDateRange}
          printRef={printRef}
          handleDownload={handleDownload}
        />
        {loading ? (
          <div className="w-full p-6 min-h-fit max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Sales Section */}
            <div className="bg-[var(--color-card)] rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[var(--color-text)] my-3">
                Sales Overview
              </h2>

              {/* Sales Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Total Sales
                  </h3>
                  <p className="text-2xl font-bold text-green-500">
                    ₹{reportData?.sales?.sales}
                  </p>
                </div>

                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Returns
                  </h3>
                  <p className="text-2xl font-bold text-red-500">
                    ₹{reportData?.sales?.returns}
                  </p>
                </div>

                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Net Sales
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{reportData?.sales?.netSales}
                  </p>
                </div>
              </div>
            </div>

            {/* Expense Section */}
            <div className="bg-[var(--color-card)] rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[var(--color-text)] my-3">
                Expense Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Purchases
                  </h3>
                  <p className="text-2xl font-bold text-red-500">
                    ₹{reportData?.expenses?.purchases}
                  </p>
                </div>

                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Other Expenses
                  </h3>
                  <p className="text-2xl font-bold text-red-500">
                    ₹{reportData?.expenses?.otherExpenses}
                  </p>
                </div>

                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Total Expenses
                  </h3>
                  <p className="text-2xl font-bold text-red-500">
                    ₹{reportData?.expenses?.total}
                  </p>
                </div>
              </div>
            </div>

            {/* Profit / Loss Section */}
            <div className="bg-[var(--color-card)] rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[var(--color-text)] my-3">
                Profit / Loss Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Gross Profit/Loss
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{reportData?.grossProfit}
                  </p>
                </div>

                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Net Profit/Loss
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{reportData?.netProfit}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-[var(--color-card)] rounded-lg p-6 flex flex-col gap-4 shadow-sm">
              <Divider title="Monthly Trends" />

              {reportData?.charts?.salesChartData?.length === 0 ||
              reportData?.charts?.expenseChartData?.length === 0 ? (
                <p className="text-center text-[var(--color-text-light)]">
                  No data available for the selected date range
                </p>
              ) : (
                <div className="chart-grid grid grid-cols-1 md:grid-cols-2 capitalize items-baseline">
                  {/* Sales Chart */}
                  <div className="">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={reportData?.charts?.salesChartData || []}>
                        <XAxis dataKey="month" />
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
                  <div className="">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={reportData?.charts?.expenseChartData || []}
                      >
                        <XAxis dataKey="month" />
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
                        <Bar dataKey="expense" barSize={40} fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfitLossReport;
