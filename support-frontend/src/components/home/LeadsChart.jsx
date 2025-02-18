import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SelectionDropDown from "./SelectionDropDown";

const LeadsChart = () => {
  const [groupBy, setGroupBy] = useState("daily");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/stats/leads-chart?groupBy=${groupBy}`,
          { credentials: "include" }
        );
        const result = await response.json();
        setData(result.stats);
      } catch (error) {
        console.error("Error fetching leads data:", error);
      }
    };

    fetchLeadsData();
  }, [groupBy]);

  return (
    <div className="h-[50vh] flex flex-col rounded-md shadow-lg bg-[var(--color-sidebar)]">
      <div className="px-3 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-xl max-lg:text-lg">Leads Overview</p>
          <SelectionDropDown groupBy={groupBy} setGroupBy={setGroupBy} />
        </div>

        {/* Legend */}
        <div className="flex items-center px-3 space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-neutral-700">Leads</span>
          </div>
        </div>
      </div>

      <div className="px-2 flex-1 text-xs md:text-sm">
        <ResponsiveContainer width="100%" height="99%">
          <AreaChart
            data={data}
            key={data?.length}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4285F4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tickFormatter={(value) =>
                groupBy === "weekly" ? `Wk ${value}` : value
              }
              interval={5}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                background: "var(--color-card-overlay)",
                border: "none",
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
              dataKey="leads"
              stroke="#4285F4"
              fillOpacity={1}
              fill="url(#colorLeads)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadsChart;
