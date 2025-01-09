import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/trending`
        );
        if (response.ok) {
          const data = await response.json();

          // Format data to include product name, category, and other details for the chart
          const formattedData = data.trendingProducts.map((item) => ({
            name: item.product.name,
            category: item.product.category,
            totalSales: item.totalSales,
            secondaryUnit: item.secondaryUnit,
          }));

          setTrendingProducts(formattedData);
        } else {
          throw new Error("Failed to fetch trending products.");
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingProducts();
  }, []);

  // Extract unique categories from the trending products
  const categories = [
    ...new Set(trendingProducts.map((product) => product.category)),
  ];

  if (loading)
    return (
      <div className="bg-[var(--color-sidebar)] p-4 rounded-md border border-neutral-500/50 w-full md:hidden lg:flex md:w-[30%] h-full flex flex-col items-center justify-center">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="bg-[var(--color-sidebar)] p-4 rounded-md border border-neutral-500/50 w-full md:hidden lg:flex md:w-[30%] h-full flex flex-col">
      <p className="text-2xl max-lg:text-xl font-bold mb-4">
        Trending Products
      </p>

      <div className="bg-[var(--color-card)] flex-1 overflow-y-scroll rounded-md p-4">
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
                  `${value} ${props?.payload?.secondaryUnit || "units"} sold`,
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                      marginBottom: "5px",
                    }}
                  >
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
                  formatter: (value, name, props) =>
                    `${value} ${props?.payload?.secondaryUnit || "units"} sold`,
                }}
              ></Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-neutral-500 text-center">
            No trending products available.
          </p>
        )}

        {/* Display unique categories */}
        {categories.length > 0 && (
          <div className="my-2">
            <p className="font-semibold text-lg py-1">Categories:</p>
            <ul className="list-disc pl-5 grid grid-cols-2 gap-2">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="text-sm text-[var(--color-text-light)]"
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingProducts;
