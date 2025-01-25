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

const RecentPurchase = () => {
  const [recentPurchase, setRecentPurchase] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPurchase = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/purchases/recent`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setRecentPurchase(data.recentPurchase);
        } else {
          throw new Error("Failed to fetch the recent purchase.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPurchase();
  }, [refetch]);

  return (
    <div className="bg-[var(--color-sidebar)] flex flex-col p-4 rounded-md border border-neutral-500/50 w-[30%] max-sm:w-full h-full overflow-y-auto">
      <div className="title flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Purchase</h2>
        <button
          onClick={() => setRefetch((prev) => !prev)}
          className="text-sm text-white bg-[var(--color-accent)] px-2 py-1 rounded hover:bg-[var(--color-accent-dark)] transition-all"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center text-[var(--color-text-light)] flex-1 overflow-y-auto flex items-center justify-center ">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : recentPurchase ? (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {/* Purchase Details */}
          <div className="bg-[var(--color-card)] p-3 rounded-md shadow-sm">
            <Link
              to={`/purchases/${recentPurchase._id}`}
              className="font-semibold text-sm text-[var(--color-accent)] hover:underline"
            >
              View Purchase Details
            </Link>
            <p>
              <span className="font-semibold">Supplier:</span>{" "}
              {recentPurchase.supplier?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {recentPurchase.supplier?.email || "N/A"}
            </p>
            <p className="text-xs italic text-gray-400">
              {formatDate(recentPurchase.date) || "N/A"}
            </p>
          </div>

          {/* Products Chart */}
          <div className="bg-[var(--color-card)] p-3 rounded-md shadow-sm flex-1 overflow-y-auto">
            <h3 className="text-base font-semibold underline mb-2">
              Products in This Purchase
            </h3>
            {recentPurchase.products?.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={Math.max(250, recentPurchase.products.length * 50)}
              >
                <BarChart
                  data={recentPurchase.products}
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
                    {recentPurchase.products.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index % 2 === 0
                            ? "var(--color-accent-dark)"
                            : "var(--color-accent-light)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[var(--color-text-light)]">
                No products in this purchase.
              </p>
            )}
            <p className="font-semibold mt-2">
              Total Amount: {recentPurchase.totalAmount} ₹
            </p>
            <p>Signed By: {recentPurchase.signedBy?.name || "N/A"}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-[var(--color-text-light)]">
          No recent purchases found.
        </p>
      )}
    </div>
  );
};

export default RecentPurchase;
