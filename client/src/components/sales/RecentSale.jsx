import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatDate } from "../utils";
import { Link } from "react-router-dom";

const RecentSale = () => {
  const [recentSale, setRecentSale] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentSale = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/recent`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setRecentSale(data.recentSale);
        } else {
          throw new Error("Failed to fetch the recent sale.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSale();
  }, [refetch]);

  return (
    <div className="bg-[var(--color-sidebar)] text-sm flex-col p-4 rounded-md border border-neutral-500/50 w-full hidden xl:flex xl:w-[35%] h-full overflow-y-auto">
      <div className="title flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Sale</h2>
        <button
          onClick={() => setRefetch((prev) => !prev)}
          className="text-sm text-white bg-[var(--color-accent)] px-2 py-1 rounded hover:bg-[var(--color-accent-dark)] transition-all"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center text-[var(--color-text-light)] flex-1 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : recentSale ? (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {/* Sale Details */}
          <div className="bg-[var(--color-card)] p-3 rounded-md shadow-sm">
            <Link to={`/sales/${recentSale.saleId}`} className="text-sm font-semibold text-accent hover:underline">
              View Sale Details
            </Link>
            <p>
              <span className="font-semibold">Customer:</span>{" "}
              {recentSale.customer?.name || recentSale.customer?.phone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {recentSale.customer?.email || "N/A"}
            </p>
            <p className="text-xs italic text-gray-400">
              {formatDate(recentSale.date) || "N/A"}
            </p>
          </div>

          {/* Products Chart */}
          <div className="bg-[var(--color-card)] p-3 rounded-md shadow-sm flex-1 overflow-y-auto">
            <h3 className="text-base font-semibold underline mb-2">
              Products in This Sale
            </h3>
            {recentSale.products?.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={Math.max(250, recentSale.products.length * 50)}
              >
                <BarChart
                  data={recentSale.products}
                  layout="vertical"
                  margin={{ top: 10, right: 3, left: 10, bottom: 10 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="productName"
                    type="category"
                    tick={{
                      fill: "var(--color-text)",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-primary)",
                      borderRadius: "8px",
                      border: "none",
                      color: "var(--color-text)",
                      padding: "10px",
                      fontSize: "0.85rem",
                    }}
                    formatter={(value, name, props) => [
                      `${value} ${props.payload.secondaryUnit || "units"} (${props.payload.rate}₹)`,
                    ]}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="var(--color-accent)"
                    barSize={15}
                  >
                    {recentSale.products.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index % 2 !== 0
                            ? "var(--color-accent-dark)"
                            : "var(--color-accent)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[var(--color-text-light)]">
                No products in this sale.
              </p>
            )}
            <p className="font-semibold mt-2">
              Total Amount: {recentSale.totalAmount} ₹
            </p>
            <p className="capitalize">Signed By: {recentSale.signedBy?.name || "N/A"}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-[var(--color-text-light)]">
          No recent sales found.
        </p>
      )}
    </div>
  );
};

export default RecentSale;
