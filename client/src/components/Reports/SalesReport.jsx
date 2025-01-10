import React, { useEffect, useRef, useState } from "react";
import ReportHeader from "./ReportHeader";
import CountUp from "react-countup";

const SalesSummary = ({ totalSales, totalReturns }) => {
  const netSales = (totalSales || 0) - (totalReturns || 0);

  return (
    <div className="bg-[var(--color-card)] shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">
        Sales Summary
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
      {[totalSales, totalReturns, netSales].map(
        (item, index) => {
          return (
            <div key={index} className="text-center text-[var(--color-text-light)] bg-[var(--color-primary)] rounded-md p-2">
              <p className="text-sm font-medium  mb-2">
                {index === 0
                  ? "Total Sales"
                  : index === 1
                  ? "Returns"
                  : "Net Sales"}
              </p>
              <div className={`text-2xl font-semibold ${index === 2 && ((item > 0) ? 'text-green-500' : 'text-red-500')}`}>
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

const SalesReport = () => {
    const printRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [dateRange, setDateRange] = useState({
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
      });

    const handleDownload = () => {

    };

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const fetchSalesReport = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/reports/sales?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,{
                    credentials: 'include',
                });
                const data = await response.json();
                if(!response.ok) {
                    throw new Error(data.message || "An error occurred.");
                }
                console.log(data);
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

        <SalesSummary totalSales={500} totalReturns={200} />

        {isLoading ? (
          <div className="text-center py-8 w-full flex-1 flex justify-center items-center">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>Sales Report</>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
