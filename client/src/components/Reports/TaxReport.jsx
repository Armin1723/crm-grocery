import React, { useRef } from "react";
import CountUp from "react-countup";
import ReportHeader from "./ReportHeader";
import TaxTable from "./TaxTable";
import { useReport } from "../../context/ReportContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const TaxSummary = ({ taxIn = 0, taxOut = 0, netPayable = 0 }) => {
  return (
    <div className="bg-[var(--color-card)] shadow-md rounded-lg p-3">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-3">
        Tax Summary
      </h2>

      <div className="grid gap-3 grid-cols-3 max-sm:grid-cols-1">
        {[
          {
            name: "Tax In",
            value: taxIn,
          },
          {
            name: "Tax Out",
            value: taxOut,
          },
          {
            name: "Tax Liability",
            value: netPayable,
          },
        ].map((item, index) => {
          return (
            <div
              key={index}
              className="text-center text-[var(--color-text-light)] bg-[var(--color-primary)] rounded-md p-2 flex flex-col justify-center"
            >
              <div className="text-sm font-medium mb-2 flex items-center justify-center gap-2 w-full">
                <p>{item.name}</p>
              </div>
              <div
                className={`text-lg lg:text-xl font-semibold ${
                  index === 2 &&
                  (item?.value > 0 ? "text-red-500" : "text-green-500")
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

const TaxReport = () => {
  const { dateRange } = useReport();

  const printRef = useRef(null);

  const {
    data,
    isFetching: loading,
    error,
  } = useQuery({
    queryKey: ["taxReport", dateRange],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/reports/tax?startDate=${
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
    const headers = [
      "_id",
      "Signed By",
      "Signed By Id",
      "tax",
      "totalAmount",
      "Created At",
    ];

    // Map the `tax` data into CSV rows
    const taxInRows = data?.taxInTransactions?.map((item) => [
      item._id,
      item.signedBy,
      item.signedById,
      item.totalTax,
      item.totalAmount,
      item.createdAt,
    ]);

    // Map the `tax out` data into CSV rows
    const taxOutRows = data?.taxOutTransactions?.map((item) => [
      item._id,
      item.signedBy,
      item.signedById,
      item.totalTax,
      item.totalAmount,
      item.createdAt,
    ]);

    // Combine the headers and rows, adding table separators
    const csvRows = [
      ["Tax Input Data"], // Table title
      headers,
      ...(taxInRows || []),
      [], // Empty line for separation
      ["Tax Output Data"], // Table title
      headers,
      ...(taxOutRows || []),
    ];

    // Convert rows into a CSV string
    const csvString = csvRows.map((row) => row.join(",")).join("\n");

    // Create a Blob from the CSV string and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Tax Data - ${dateRange.startDate} to ${dateRange.endDate}.csv`;
    link.click();
  };

  return (
    <div className="w-full p-6 flex-1 max-sm:p-3 bg-[var(--color-sidebar)] rounded-lg">
      <div className="mx-auto space-y-3 rounded-lg p-2 flex flex-col h-full overflow-y-auto">
        <ReportHeader
          title="tax"
          printRef={printRef}
          handleDownload={handleDownload}
        />

        {loading ? (
          <div className="text-center py-8 w-full flex-1 flex justify-center items-center">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 flex-1 flex flex-col items-center justify-center">
            {error.message || "Something went wrong."}
          </div>
        ) : (
          <div className="flex flex-col gap-3" ref={printRef}>
            <TaxSummary
              taxIn={data?.totalTaxIn}
              taxOut={data?.totalTaxOut}
              netPayable={data?.netPayable}
            />

            <TaxTable title="Input Tax" data={data?.taxInTransactions} />
            <TaxTable title="Output Tax" data={data?.taxOutTransactions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxReport;
