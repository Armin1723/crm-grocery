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

const RecentPurchase = () => {
  const [recentPurchase, setRecentPurchase] = useState(null);
  const [refetch, setRefetch] = React.useState(false);

  useEffect(() => {
    const fetchRecentPurchase = async () => {
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
        console.error("Error fetching recent purchase:", error.message);
      }
    };

    fetchRecentPurchase();
  }, [refetch]);

  return (
    <div className="bg-[var(--color-sidebar)] flex flex-col sm:hidden lg:flex p-4 rounded-md border border-neutral-500/50 w-[30%] max-sm:w-full max-h-[70vh] min-h-[50vh] overflow-y-auto">
      <div className="title flex gap-2 items-center mb-2">
        <p className="text-xl max-lg:text-lg font-bold ">
          Recent Purchase
        </p>
        <div
          className="w-4 rounded-full aspect-square border-t-2 border-b-2 border-accent cursor-pointer"
          onClick={() => setRefetch((p) => !p)}
        />
      </div>

      <div className="bg-[var(--color-card)] flex-1 overflow-y-scroll p-2 rounded-md">
        {/* Display purchase details */}
        <div className="mb-3">
          <h3 className="font-semibold">Purchase Details</h3>
          <p>
            Supplier:
            <span className="font-semibold">
              {recentPurchase?.supplier?.name}
            </span>
          </p>
          <p>Email: {recentPurchase?.supplier?.email || "N/A"}</p>
          <p className="text-xs italic">{formatDate(recentPurchase?.date) || "N/A"}</p>
        </div>

        <div className="bg-[var(--color-card)]">
          <h3 className="text-base font-semibold underline">Products in This Purchase</h3>

          {recentPurchase?.products.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={recentPurchase?.products}
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
                  itemStyle={{ fontSize: "14px", lineHeight: "1" }}
                  formatter={(value, name, props) => [
                    `${value} ${props.payload.unit || "units"} (${props.payload.rate}₹)`,
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        marginBottom: "5px",
                      }}
                    >
                      <p>{props.payload.productName}</p>
                    </div>,
                  ]}
                />
                <Bar
                  dataKey="quantity"
                  fill="var(--color-accent)"
                  barSize={15}
                  label={{
                    position: "bottom",
                    fill: "var(--color-text)",
                    fontSize: 12,
                    formatter: (value, name, props) =>
                      `${value} ${props?.payload?.unit || "units"}`,
                  }}
                >
                  {recentPurchase?.products.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(${index * 1340}, 70%, 50%)`}
                    />
                  ))}

                  {recentPurchase?.products.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(${index * 1340}, 70%, 50%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-neutral-500 flex-1">
              No products in this purchase.
            </p>
          )}

          <p className="font-semibold">Total Amount: {recentPurchase?.totalAmount} Rs</p>
          <p>Signed By: {recentPurchase?.signedBy?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default RecentPurchase;
