import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/products/trending`);
        if (response.ok) {
          const data = await response.json();
          // Format data to include product name and category for the chart
          const formattedData = data.trendingProducts.map((item) => ({
            name: item.product.name,
            category: item.product.category,
            totalSales: item.totalSales,
          }));
          setTrendingProducts(formattedData);
        } else {
          throw new Error("Failed to fetch trending products.");
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="bg-[var(--color-sidebar)] p-4 rounded-md border border-neutral-500/50 w-1/4 max-sm:w-full">
      <p className="text-2xl max-lg:text-xl font-bold mb-4">Trending Products</p>
      <div className="bg-[var(--color-card)] flex-1 overflow-y-scroll">
        {trendingProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={trendingProducts}
              layout="vertical"
              margin={{ top: 20, right: 3, left: 10, bottom: 10 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "var(--color-text)", fontSize: 10, fontWeight: "bold" }}
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
                  `${value} sold`,
                  <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" }}>
                    {props.payload.name}
                  </div>,
                ]}
              />
              <Bar
                dataKey="totalSales"
                fill="var(--color-accent)"
                barSize={15}
                label={{
                  position: "bottom",
                  fill: "var(--color-text)",
                  fontSize: 12,
                  formatter: (value) => `${value} sold`,
                }}
              >
                {trendingProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 1340}, 70%, 50%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-neutral-500 flex-1">No trending products available.</p>
        )}
      </div>
    </div>
  );
};

export default TrendingProducts;
