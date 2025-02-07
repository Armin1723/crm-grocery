import { useQuery } from "@tanstack/react-query";
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
  
  const { data: trendingProducts, error, isFetching: loading } = useQuery({
    queryKey: ["trendingProducts"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/trending`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      return data.trendingProducts.map((item) => ({
        name: item.product.name,
        category: item.product.category,
        totalSales: item.totalSales,
        secondaryUnit: item.secondaryUnit,
      }));
    },
    staleTime: 2 * 60 * 1000,
  })

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  //useEffect to set filteredProducts to trendingProducts initially
  useEffect(() => {
    if (trendingProducts) {
      setFilteredProducts(trendingProducts);
    }
  }, [trendingProducts]);

  const categories = [
    "All",
    ...new Set(trendingProducts?.map((product) => product.category)),
  ];
  
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setFilteredProducts(
      category === "All"
        ? trendingProducts
        : trendingProducts.filter((product) => product.category === category)
    );
  };

  if (loading)
    return (
      <div className="bg-[var(--color-sidebar)] p-4 rounded-md border border-neutral-500/50 w-full h-full flex flex-col items-center justify-center">
        <div className="spinner" />
      </div>
    );

  if (error)
    return (
      <div className="bg-[var(--color-sidebar)] p-4 rounded-md border border-red-500 w-full h-full flex flex-col items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );

  return (
    <div className="bg-[var(--color-sidebar)] p-4 rounded-md border border-neutral-500/50 w-full xl:w-[30%] h-full flex flex-col justify-between">
      <p className="text-2xl max-lg:text-xl font-bold mb-4">
        Trending Products
      </p>

      <div className="bg-[var(--color-card)] flex-1 flex flex-col overflow-y-auto rounded-md p-4">
        {categories.length > 1 && (
          <div className="mb-2 flex-1">
            <p className="font-semibold mb-2">Filter Trending Categories:</p>
            <select
              className="w-full bg-[var(--color-sidebar)] text-[var(--color-text)] p-2 rounded-md border border-neutral-500/50 outline-none"
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              {categories?.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        {filteredProducts?.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={Math.max(280, filteredProducts?.length * 50)}
          >
            <BarChart
              data={filteredProducts}
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
          <p className="text-neutral-500 text-center flex-1">
            No trending products available in this category.
          </p>
        )}

        <div className="text-xs text-[var(--color-text-light)] italic mt-4">
          *Data for {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;
