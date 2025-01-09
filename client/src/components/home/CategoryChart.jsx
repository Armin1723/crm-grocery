import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const CategoryChart = () => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Show only the value
      return (
        <div
          style={{
            background: "var(--color-card)",
            border: "none",
            borderRadius: "10px",
            padding: "0 10px",
            fontSize: "0.875rem",
            color: "var(--color-text-light)",
          }}
        >
          {data[payload[0].name]._id} :
          {' '}{payload[0].value}
        </div>
      );
    }

    return null; // Do not render anything if tooltip is not active
  };

  const dataCopy = [
    { _id: "Electronics", value: 400 },
    { _id: "Clothing", value: 300 },
    { _id: "Footwear", value: 300 },
    { _id: "Accessories", value: 200 },
    { _id: "Home Appliances", value: 100 },
    { _id: "Others", value: 100 },
  ];
  const [activeIndex, setActiveIndex] = useState(null);
  const [data, setData] = useState(dataCopy);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/stats/products-chart`
        );
        const data = await response.json();
        if (response.ok) {
          setData(data.data);
        } else throw new Error(data.message);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF1919",
  ];

  return (
    <div className="w-full h-2/3 min-h-[40vh] md:min-h-fit relative flex flex-col justify-center py-3 px-4 bg-[var(--color-sidebar)] border border-neutral-500/50 rounded-md">
        <div className="title px-3 py-2 ">
          <p className="text-xl font-bold">Stocks</p>
          <p className="text-xs text-neutral-500">by category</p>
        </div>

        <div className="chart w-full relative cursor-pointer flex-1 flex">
          <ResponsiveContainer width="99%" height="99%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    cursor="pointer"
                    stroke={
                      index === activeIndex
                        ? COLORS[index % COLORS.length]
                        : "none"
                    }
                    strokeWidth={index === activeIndex ? 2 : 0.5}
                  />
                ))}
              </Pie>
              {/* Tooltip for displaying values */}
              <Tooltip
              content={<CustomTooltip />}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

      {/* Legends */}
      <div className="flex overflow-x-auto items-start space-x-2">
        {data?.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 shrink-0">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <p className="text-sm font-medium text-[var(--color-text-light)] capitalize">
              {entry._id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
