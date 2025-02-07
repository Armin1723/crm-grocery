import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SelectionDropDown from "./SelectionDropDown";
import { useQuery } from "@tanstack/react-query";

const SalesChart = () => {
  const [groupBy, setGroupBy] = useState("daily");

  const {data, isFetching: loading} = useQuery({
    queryKey: ["salesChart", {groupBy}],
    queryFn: async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/stats/sales-chart?groupBy=${groupBy}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      return data.stats;
    },
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div className="flex-1 flex flex-col rounded-md border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="header px-3 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="title flex items-center gap-2 flex-wrap">
          <p className="font-bold text-xl max-lg:text-lg ">Sales/Purchases</p>
          <SelectionDropDown groupBy={groupBy} setGroupBy={setGroupBy} />
        </div>

        {/* Legend */}
        <div className="flex justify-end items-center px-3 space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-neutral-700">Sales</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm font-medium text-neutral-700">
              Purchases
            </span>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="px-2 flex-1 min-h-[40vh] text-xs md:text-sm">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              key={data.length}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tickFormatter={(value) => {
                  if (groupBy === "daily") return value;
                  if (groupBy === "weekly") return `Wk ${value}`;
                  return value;
                }}
                interval={5}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card-overlay)",
                  border: "none",
                  gap: "0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ fontWeight: "bold", textTransform: "capitalize" }}
                labelStyle={{
                  color: "var(--color-text-light)",
                  fontSize: "0.7rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stackId="1"
                stroke="#5d3fd3"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
              <Area
                type="monotone"
                dataKey="purchases"
                stackId="1"
                stroke="seaGreen"
                fillOpacity={1}
                fill="url(#colorPv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
