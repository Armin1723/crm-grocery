import React, { useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import CountUp from "react-countup";
import ExpenseTable from "./ExpenseTable";
import ReportHeader from "./ReportHeader";
import { FaChevronCircleDown } from "react-icons/fa";
import { useReport } from "../../context/ReportContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SubscriptionOverlay from "../utils/SubscriptionOverlay";

const ExpenseSummary = ({
  totalPurchases = 0,
  totalOtherExpenses = 0,
  totalReturns = 0,
}) => {
  const [expanded, setExpanded] = useState(false);

  const totalExpenses = totalPurchases + totalOtherExpenses - totalReturns;
  const netPurchases = totalPurchases - totalReturns;

  return (
    <div className="bg-[var(--color-card)] shadow-md rounded-lg p-3">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-3">
        Expense Summary
      </h2>

      <div className="grid gap-3 grid-cols-3 max-sm:grid-cols-1">
        {[
          {
            name: "Net Purchases",
            value: netPurchases,
          },
          {
            name: "Other Expenses",
            value: totalOtherExpenses,
          },
          {
            name: "Total Expenses",
            value: totalExpenses,
          },
        ].map((item, index) => {
          return (
            <div
              key={index}
              className="boxes text-center text-[var(--color-text-light)] bg-[var(--color-primary)] rounded-md p-2 flex flex-col justify-center"
            >
              <div className="text-sm font-medium mb-2 flex items-center justify-center gap-2 w-full">
                <p>{item.name}</p>
                {item?.name === "Net Purchases" && (
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
                  index === 2 && "text-red-500"
                }`}
              >
                ₹
                <CountUp
                  end={item?.value || 0}
                  decimals={2}
                  duration={1}
                  separator=","
                />
              </div>
              {item.name == "Net Purchases" && (
                <div
                  className={` ${
                    expanded === index ? "max-h-screen" : "max-h-0"
                  } overflow-hidden transition-all duration-300 text-sm font-medium mt-2 flex flex-col`}
                >
                  <p>Purchases: ₹{totalPurchases?.toFixed(2)}</p>
                  <p>Returns: ₹{totalReturns?.toFixed(2)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const COLORS = [
  "#4299E1", // Blue
  "#48BB78", // Green
  "#ED8936", // Orange
  "#9F7AEA", // Purple
  "#F56565", // Red
  "#38B2AC", // Teal
];

const ExpenseReport = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const { dateRange } = useReport();

  const printRef = useRef(null);

  const {
    data,
    isFetching: loading,
    error,
  } = useQuery({
    queryKey: [
      "expenseReport",
      { startDate: dateRange?.startDate, endDate: dateRange?.endDate },
    ],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/reports/expense?startDate=${
          dateRange?.startDate
        }&endDate=${dateRange?.endDate}`,
        {
          credentials: "include",
        }
      );

      const actualData = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw {
            subscription: true,
            message: actualData.message || "Subscription Expired",
          };
        }
        throw {
          subscription: false,
          message: actualData.message || "Something went wrong.",
        };
      }
      return actualData.data;
    },
    retry: false,
  });

  const handleDownload = () => {
    const headers = [
      "_id",
      "Signed By",
      "Supplier",
      "Created At",
      "Source",
      "Category",
      "Amount",
    ];

    // Map the data into CSV rows
    const purchaseRows = data?.purchases.map((item) => [
      item?._id,
      item?.signedBy,
      item?.supplier,
      item?.createdAt,
      item?.category,
      item?.source,
      item?.amount,
    ]);

    // Map the data into CSV rows
    const expenseRows = data?.otherExpenses.map((item) => [
      item?._id,
      item?.signedBy,
      item?.supplier,
      item?.createdAt,
      item?.category,
      item?.source,
      item?.amount,
    ]);

    // Map the data into CSV rows
    const purchaseReturnRows = data?.purchaseReturnsList.map((item) => [
      item?._id,
      item?.signedBy,
      item?.supplier,
      item?.createdAt,
      item?.category,
      item?.source,
      item?.amount,
    ]);

    const csvRows = [
      ["Purchase Data"], // Table title
      headers,
      ...(purchaseRows || []),
      [], // Empty line for separation
      ["Other Expense Data"], // Table title
      headers,
      ...(expenseRows || []),
      [], // Empty line for separation
      [" Returns Data"], // Table title
      headers,
      ...(purchaseReturnRows || []),
    ];

    // Convert rows into a CSV string
    const csvString = csvRows?.map((row) => row.join(",")).join("\n");

    // Create a Blob from the CSV string and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Expense List - ${dateRange.startDate} to ${dateRange.endDate}.csv`;
    link.click();
  };

  return (
    <div className="w-full p-6 flex-1 max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg">
      <div className="mx-auto space-y-3 rounded-lg p-2 flex flex-col h-full overflow-y-auto">
        <ReportHeader
          title="expense"
          printRef={printRef}
          handleDownload={handleDownload}
        />

        {loading ? (
          <div className="text-center py-8 w-full flex-1 flex justify-center items-center">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          error.subscription ? (
            <SubscriptionOverlay />
          ) : (
            <div className="text-center text-red-500 py-8 flex-1 flex items-center justify-center w-full">
              {error.message || "Something went wrong."}
            </div>
          )
        ) : (
          <>
            <div className="flex flex-col gap-2 w-full" ref={printRef}>
              <ExpenseSummary
                totalPurchases={data?.totalPurchases}
                totalOtherExpenses={data?.totalOtherExpenses}
                totalReturns={data?.totalReturns}
              />

              <ExpenseTable title="Purchase" data={data?.purchases} />
              <ExpenseTable title="Other Expense" data={data?.otherExpenses} />
              <ExpenseTable title="Return" data={data?.purchaseReturnsList} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
              {data?.expensesByCategory?.length > 0 && (
                <div className="bg-[var(--color-card)] rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold pb-4 mb-3 border-b border-neutral-500/50">
                    Purchases by Category
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data?.expensesByCategory}
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
                        {data?.expensesByCategory.map((entry, index) => (
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
                    {data?.expensesByCategory.map((entry, index) => (
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

              {data?.expensesBySupplier?.length > 0 && (
                <div className="bg-[var(--color-card)] rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold pb-4 mb-3 border-b border-neutral-500/50">
                    Purchases by Suppliers
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data?.expensesBySupplier.slice(0, 5)}>
                      <XAxis dataKey="supplier" />
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
                  {/* Legends */}
                  <div className="flex overflow-x-auto max-sm:items-start items-center space-x-2 w-full justify-center">
                    {data?.expensesBySupplier?.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 shrink-0"
                      >
                        <span className="w-3 h-3 rounded-full bg-accent"></span>
                        <p className="text-sm font-medium text-[var(--color-text-light)] capitalize">
                          {entry.supplier}
                        </p>
                      </div>
                    ))}
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

export default ExpenseReport;
