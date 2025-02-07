import React, { useRef, useState } from "react";
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
import { FaChevronCircleDown } from "react-icons/fa";
import { useReport } from "../../context/ReportContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const COLORS = [
  "#4299E1", // Blue
  "#48BB78", // Green
  "#ED8936", // Orange
  "#9F7AEA", // Purple
  "#F56565", // Red
  "#38B2AC", // Teal
];

const SalesSummary = ({
  totalSales,
  totalReturns,
  cashInHand,
  cashAtBank,
  netSales,
}) => {
  return (
    <div className="bg-[var(--color-card)] shadow-md rounded-lg p-3">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-3">
        Sales Summary
      </h2>

      <div className="grid gap-3 grid-cols-3 max-sm:grid-cols-1 ">
        {[
          {
            name: "Total Sales",
            value: totalSales,
          },
          {
            name: "Total Returns",
            value: totalReturns,
          },
          {
            name: "Net Sales",
            value: netSales,
          },
        ].map((item, index) => {
          const [expanded, setExpanded] = useState(null);
          return (
            <div
              key={index}
              className="text-center text-[var(--color-text-light)] bg-[var(--color-primary)] rounded-md p-2 flex flex-col items-center justify-center"
            >
              <div className="text-sm font-medium mb-2 flex items-center justify-center gap-2 w-full">
                <p>{item.name}</p>
                {item?.name === "Net Sales" && (
                  <FaChevronCircleDown
                    className="cursor-pointer"
                    onClick={() =>
                      setExpanded((p) => (p === index ? null : index))
                    }
                  />
                )}
              </div>
              <div
                className={`text-lg lg:text-xl font-semibold ${
                  index == 2
                    ? item.value > 0
                      ? "text-green-500"
                      : "text-red-500"
                    : ""
                }`}
              >
                ₹
                <CountUp
                  end={item.value || 0}
                  decimals={2}
                  duration={1}
                  separator=","
                />
              </div>
              {index === 2 && (
                <div
                  className={` ${
                    expanded === index ? "max-h-screen" : "max-h-0"
                  } overflow-hidden transition-all duration-300 text-sm font-medium mt-2 flex flex-col`}
                >
                  <p>Cash In Hand: ₹{cashInHand?.toFixed(2)}</p>
                  <p>Cash In Bank:₹{cashAtBank?.toFixed(2)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SalesReport = () => {
  const printRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(null);

  const { dateRange } = useReport();

  const handleDownload = () => {
    const headers = [
      "_id",
      "Signed By",
      "Customer",
      "Created At",
      "Source",
      "Category",
      "Amount",
    ];

    // Map the `sales` data into CSV rows
    const salesRows = data?.salesList?.map((item) => [
      item._id,
      item.signedBy,
      item.customer,
      item.createdAt,
      item.source,
      item.category,
      item.amount,
    ]);

    // Map the `salesReturn` data into CSV rows
    const salesReturnsRows = data?.returnsList?.map((item) => [
      item._id,
      item.signedBy,
      item.customer,
      item.createdAt,
      item.source,
      item.category,
      item.amount,
    ]);

    // Combine the headers and rows, adding table separators
    const csvRows = [
      ["Sales Data"], // Table title
      headers,
      ...(salesRows || []),
      [], // Empty line for separation
      ["Sales Returns Data"], // Table title
      headers,
      ...(salesReturnsRows || []),
    ];

    // Convert rows into a CSV string
    const csvString = csvRows.map((row) => row.join(",")).join("\n");

    // Create a Blob from the CSV string and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Sales Data - ${dateRange.startDate} to ${dateRange.endDate}.csv`;
    link.click();
  };

  const {
    data,
    isFetching: loading,
    error,
  } = useQuery({
    queryKey: ["salesReport", dateRange],
    queryFn: async () => {
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
        toast.error(data.message);
        throw new Error(data.message);
      }
      return data.data;
    },
    retry: false,
  });

  return (
    <div className="w-full p-6 flex flex-col flex-1 max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg">
      <div className="mx-auto space-y-3 rounded-lg p-2 flex-1 flex flex-col w-full overflow-y-auto">
        <ReportHeader
          title="sales"
          printRef={printRef}
          handleDownload={handleDownload}
        />

        {loading ? (
          <div className="text-center py-8 w-full flex-1 flex justify-center items-center">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 flex-1 flex flex-col items-center justify-center">{error.message || "Something went wrong"}</div>
        ) : (
          <>
            <div className="flex flex-col gap-2" ref={printRef}>
              <SalesSummary
                totalSales={data?.totalSales}
                totalReturns={data?.totalSalesReturns}
                cashInHand={data?.cashInHand}
                cashAtBank={data?.cashAtBank}
                netSales={data?.netSales}
              />

              <SalesTable data={data?.salesList} title="sales" />
              <SalesTable data={data?.returnsList} title="returns" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
              {data?.salesByCategory?.length > 0 && (
                <div className="bg-[var(--color-card)] rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold pb-4 mb-3 border-b border-neutral-500/50">
                    Sales by Category
                  </h2>
                  <ResponsiveContainer
                    width="100%"
                    height={300}
                    style={{ overflow: "visible" }}
                  >
                    <PieChart>
                      <Pie
                        data={data?.salesByCategory}
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
                        {data?.salesByCategory.map((entry, index) => (
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

              {data?.salesByCustomer?.length > 0 && (
                <div className="bg-[var(--color-card)] rounded-lg shadow p-6 flex-1 flex flex-col justify-between">
                  <h2 className="text-xl font-bold pb-4 mb-3 border-b border-neutral-500/50">
                    Top Customers
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data?.salesByCustomer?.slice(0, 5)}>
                      <XAxis
                        dataKey="customer"
                        tickFormatter={(value) => {
                          if (value.length > 6)
                            return value.substring(0, 5) + "...";
                          return value;
                        }}
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
