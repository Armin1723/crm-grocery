import React, { useEffect, useRef, useState } from "react";
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

  return (
    <div
      className="w-full p-6 min-h-fit max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg "
      ref={printRef}
    >
      <div className="max-w-7xl mx-auto space-y-3 rounded-lg p-2 m-2 border border-neutral-500/50">
        <ReportHeader
          title="P/L"
          dateRange={dateRange}
          setDateRange={setDateRange}
          printRef={printRef}
          handleDownload={null}
        />
        {loading ? (
          <div className="w-full p-6 min-h-fit max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <PLData reportData={reportData} />

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
                  <div className="">
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
                          dataKey="expense"
                          stackId="a"
                          barSize={40}
                          fill="#5d3fd388"
                        />
                        <Bar
                          dataKey="purchase"
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
              <h2 className="text-xl font-bold text-[var(--color-text)] my-3">
                Profit / Loss Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Gross Profit/Loss
                  </h3>
                  <CountUp
                    className={`text-2xl font-bold ${
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

                <div className="bg-[var(--color-primary)] p-4 rounded-lg">
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Net Profit/Loss
                  </h3>
                  <CountUp
                    className={`text-2xl font-bold ${
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProfitLossReport;
