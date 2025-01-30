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
import { useReport } from "../../context/ReportContext";

const ProfitLossReport = () => {
  const printRef = useRef(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { dateRange } = useReport();

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
    <div className="w-full p-1 min-h-fit bg-[var(--color-sidebar)] rounded-lg ">
      <div className="mx-auto space-y-2 rounded-lg p-1">
        <ReportHeader title="P/L" printRef={printRef} handleDownload={null} />
        {loading ? (
          <div className="w-full p-6 min-h-fit max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg flex items-center justify-center">
            <div className="spinner"></div>
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
              <h2 className="text-xl font-bold text-[var(--color-text)] my-3">
                Profit / Loss Overview
              </h2>

              <div className="grid grid-cols-2 gap-3 my-2">
                <div
                  className={`bg-[var(--color-primary)] p-3 rounded-lg ${
                    reportData?.grossProfit < 0
                      ? "bg-red-600/20"
                      : "bg-green-600/20"
                  }`}
                >
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Gross Profit/Loss
                  </h3>
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
                  <h3 className="text-sm text-[var(--color-text-light)]">
                    Net Profit/Loss
                  </h3>
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
