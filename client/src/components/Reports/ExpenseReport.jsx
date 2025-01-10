import React, { useEffect, useRef, useState } from "react";
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

const ExpenseSummary = ({ totalPurchases, totalOtherExpenses }) => {
  const totalExpenses = (totalPurchases || 0) + (totalOtherExpenses || 0);

  return (
    <div className="bg-[var(--color-card)] shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">
        Expense Summary
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
      {[totalPurchases, totalOtherExpenses, totalExpenses].map(
        (item, index) => {
          return (
            <div key={index} className="text-center text-[var(--color-text-light)] bg-[var(--color-primary)] rounded-md p-2">
              <p className="text-sm font-medium  mb-2">
                {index === 0
                  ? "Total Purchases"
                  : index === 1
                  ? "Other Expenses"
                  : "Total Expenses"}
              </p>
              <div className={`text-2xl font-semibold ${index === 2 && 'text-red-500'}`}>
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
        }
      )}
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
  const [data, setData] = useState({
    totalExpenses: 0,
    expensesByCategory: [],
    expensesBySupplier: [],
    expenseList: [],
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const printRef = useRef(null);

  useEffect(() => {
    const fetchExpenseReport = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/reports/expense?startDate=${dateRange.startDate}&endDate=${
            dateRange.endDate
          }`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError("Failed to fetch expense report. Please try again later.");
        console.error("Error fetching expense report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenseReport();
  }, [dateRange]);

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
    const csvRows = data?.expenseList.map((item) => [
      item._id,
      item.signedBy,
      item.supplier,
      item.createdAt,
      item.category,
      item.source,
      item.amount,
    ]);

    // Add the header to the rows
    csvRows.unshift(headers);

    // Convert rows into a CSV string
    const csvString = csvRows.map((row) => row.join(",")).join("\n");

    // Create a Blob from the CSV string and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Expense List - ${dateRange.startDate} to ${dateRange.endDate}.csv`;
    link.click();
  };

  return (
    <div
      className="w-full p-6 min-h-fit max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg"
      ref={printRef}
    >
      <div className="max-w-7xl mx-auto space-y-3 rounded-lg border border-neutral-500/50 p-2 m-2">
        <ReportHeader
          title="expense"
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
            <ExpenseSummary
              totalPurchases={data.totalPurchases}
              totalOtherExpenses={data?.totalOtherExpenses}
            />

            <ExpenseTable expenses={data?.expenseList} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
              {data.expensesByCategory?.length > 0 && (
                <div className="bg-[var(--color-card)] rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold pb-4 mb-3 border-b border-neutral-500/50">
                    Purchases by Category
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.expensesByCategory}
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
                        {data.expensesByCategory.map((entry, index) => (
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

              {data.expensesBySupplier?.length > 0 && (
                <div className="bg-[var(--color-card)] rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold pb-4 mb-3 border-b border-neutral-500/50">
                    Purchases by Suppliers
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.expensesBySupplier.slice(0, 5)}>
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
                    {data?.expensesBySupplier.map((entry, index) => (
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
