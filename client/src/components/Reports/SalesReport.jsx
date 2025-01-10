import React, { useEffect, useRef, useState } from "react";
import ReportHeader from "./ReportHeader";
import CountUp from "react-countup";
import SalesTable from "./SalesTable";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#4299E1", // Blue
  "#48BB78", // Green
  "#ED8936", // Orange
  "#9F7AEA", // Purple
  "#F56565", // Red
  "#38B2AC", // Teal
];

const SalesSummary = ({ totalSales, totalReturns }) => {
  const netSales = (totalSales || 0) - (totalReturns || 0);

  return (
    <div className="bg-[var(--color-card)] shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">
        Sales Summary
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {[totalSales, totalReturns, netSales].map((item, index) => {
          return (
            <div
              key={index}
              className="text-center text-[var(--color-text-light)] bg-[var(--color-primary)] rounded-md p-2"
            >
              <p className="text-sm font-medium  mb-2">
                {index === 0
                  ? "Total Sales"
                  : index === 1
                  ? "Returns"
                  : "Net Sales"}
              </p>
              <div
                className={`text-2xl font-semibold ${
                  index === 2 && (item > 0 ? "text-green-500" : "text-red-500")
                }`}
              >
                ₹
                <CountUp
                  end={item || 0}
                  decimals={2}
                  duration={1}
                  separator=","
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SalesReport = () => {
  const printRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [data, setData] = useState({
    totalSales: 0,
    salesByCategory: [],
    salesByCustomer: [],
    salesList: [],
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });

  const handleDownload = () => {};

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetchSalesReport = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/reports/sales?startDate=${
            dateRange.startDate
          }&endDate=${dateRange.endDate}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "An error occurred.");
        }
        setData(data.data);
      } catch (error) {
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesReport();
  }, [dateRange]);

  return (
    <div
      className="w-full p-6 min-h-fit max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg"
      ref={printRef}
    >
      <div className="max-w-7xl mx-auto space-y-3 rounded-lg border border-neutral-500/50 p-2 m-2">
        <ReportHeader
          title="sales"
          dateRange={dateRange}
          setDateRange={setDateRange}
          printRef={printRef}
          handleDownload={handleDownload}
        />

        {isLoading ? (
          <div className="text-center py-8 w-full flex-1 flex justify-center items-center">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <SalesSummary
              totalSales={data?.totalSales}
              totalReturns={data?.totalSalesReturns}
            />

            <SalesTable data={data?.salesList} title="sales" />
            <SalesTable data={data?.returnsList} title="returns" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.salesByCategory?.length > 0 && (
                <div className="bg-[var(--color-card)] rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold pb-4 mb-3 border-b border-neutral-500/50">
                    Sales by Category
                  </h2>
                  <ResponsiveContainer width="100%" height={300} style={{ overflow: "visible"}}>
                    <PieChart>
                      <Pie
                        data={data.salesByCategory}
                        dataKey="total"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={2}
                        fill="#8884d8"
                        label={({ name, value }) =>
                          `${name}: ₹${value.toFixed(2)}`
                        }
                        onMouseEnter={() => setActiveIndex((_, index) => index)}
                      >
                        {data.salesByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke={
                              index === activeIndex
                                ? COLORS[index % COLORS.length]
                                : "none"
                            }
                            strokeWidth={index === activeIndex ? 2 : 0.5}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-primary)",
                          borderRadius: "8px",
                          border: "none",
                          color: "var(--color-text)",
                          padding: "10px",
                        }}
                        itemStyle={{
                          fontSize: "14px",
                          lineHeight: "1",
                          color: "var(--color-text)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legends */}
                  <div className="w-full justify-center flex overflow-x-auto items-center max-sm:items-start space-x-2">
                    {data?.salesByCategory.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 shrink-0"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <p className="text-sm font-medium text-[var(--color-text-light)] capitalize">
                          {entry.category}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.salesByCustomer?.length > 0 && (
                <div className="bg-[var(--color-card)] rounded-lg shadow p-6 flex-1 flex flex-col justify-between">
                  <h2 className="text-xl font-bold pb-4 mb-3 border-b border-neutral-500/50">
                    Top Customers
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.salesByCustomer.slice(0, 5)}>
                      <XAxis dataKey="customer" />
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
                      <Bar dataKey="total" barSize={40} fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
