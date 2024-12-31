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

const RecentSale = () => {
  const [recentSale, setRecentSale] = useState(null);
  const [refetch, setRefetch] = React.useState(false);

  useEffect(() => {
    const fetchRecentSale = async () => {
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
        console.error("Error fetching recent sale:", error.message);
      }
    };

    fetchRecentSale();
  }, [refetch]);

  return (
    <div className="bg-[var(--color-sidebar)] flex flex-col sm:hidden lg:flex p-4 rounded-md border border-neutral-500/50 w-[30%] max-sm:w-full min-h-[50vh] overflow-y-auto">
      <div className="title flex gap-2 items-center mb-2">
        <p className="text-xl max-lg:text-lg font-bold ">
          Recent Sale
        </p>
        <div
          className="w-4 rounded-full aspect-square border-t-2 border-b-2 border-accent cursor-pointer"
          onClick={() => setRefetch((p) => !p)}
        />
      </div>

      <div className="bg-[var(--color-card)] flex-1 overflow-y-scroll p-2 rounded-md">
        {/* Display sale details */}
        <div className="mb-3">
          <h3 className="font-semibold">Sale Details</h3>
          <p>
            Customer: 
            <span className="">{" "}
              {recentSale?.customer?.name || recentSale?.customer?.phone || "N/A"}
            </span>
          </p>
          <p>Email: {recentSale?.customer?.email || "N/A"}</p>
          <p className="text-xs italic">{formatDate(recentSale?.date)}</p>
        </div>

        <div className="bg-[var(--color-card)]">
          <h3 className="text-base font-semibold underline">Products in This sale</h3>

          {recentSale?.products.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={recentSale?.products}
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
                    `${value} ${props.payload.secondaryUnit || "units"} (${props.payload.rate}₹)`,
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        marginBottom: "5px",
                      }}
                    >
                      <p>{props?.payload?.productName}</p>
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
                      `${value} ${props?.payload?.secondaryUnit || "units"}`,
                  }}
                >
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-neutral-500 flex-1">
              No products in this sale.
            </p>
          )}

          <p className="font-semibold">Total Amount: {recentSale?.totalAmount} Rs</p>
          <p>Signed By: {recentSale?.signedBy?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default RecentSale;
