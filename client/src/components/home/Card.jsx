import { motion } from "framer-motion";
import React from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

const Card = ({ data, index, chartData = {} }) => {
  const chartDataCopy = [
    {
      count: 2400,
    },
    {
      count: 1398,
    },
    {
      count: 9800,
    },
    {
      count: 3908,
    },
    {
      count: 4800,
    },
    {
      count: 3800,
    },
    {
      count: 4300,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip-container shadow-md bg-[var(--color-sidebar)] p-2 rounded-md">
          <p
            className="text-sm max-sm:text-xs"
            style={{
              color: data.color,
            }}
          >
            {payload[0].value} {/* rupee symbol */}
            {data.title == "Products" ? "items" : "₹"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{
        opacity: 1,
        y: 0,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
      }}
      exit={{
        opacity: 0,
        y: 50,
      }}
      className="snap-start flex min-w-full tab:min-w-[50%] lg:min-w-[33%] xl:min-w-[25%]"
    >
      <div
        className="card-wrapper relative overflow-hidden mx-2 flex w-full aspect-[16/8] border rounded-md items-center bg-[var(--color-sidebar)] border-b-4 border-neutral-500/50 shadow-md"
        style={{
          shadowColor: data?.color,
        }}
      >
        <div className="left w-2/5 h-full flex flex-col items-start justify-center px-4 py-3">
          <div className="top-group flex flex-col gap-2">
            <div className="title flex items-center gap-2 text-xl max-lg:text-base max-sm:text-xl">
              <data.icon
                className=""
                style={{
                  color: data?.color,
                }}
              />
              <p className="text-base lg:text-lg font-bold">{data?.title}</p>
            </div>
            <p className="text-xl max-sm:text-lg font-bold ">
              <CountUp
                end={
                  data.title === "Inventory"
                    ? chartData.total
                    : chartData?.currentValue
                }
                duration={2}
              />
            </p>
          </div>
          <Link
            to={data?.to}
            className="hover:opacity-75 transition-all duration-300 ease-in-out flex items-center rounded-full text-sm"
            style={{
              color: data?.color,
            }}
          >
            View all
          </Link>
        </div>
        <div className="right flex flex-col flex-1 overflow-hidden h-full w-full px-6 max-sm:px-4 py-2">
          <div className="chart h-2/3 max-h-[66%] w-full flex items-center justify-center overflow-hidden">
            <ResponsiveContainer width="99%" height="99%">
              <LineChart
                data={chartData?.data || []}
                key={chartData?.data?.length}
              >
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  // dataKey="count"
                  dataKey={data.title === "Inventory" ? "totalValue" : "count"}
                  stroke={data?.color}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="inc-dec w-full flex flex-col items-end justify-center flex-1">
            <div className="flex flex-col items-end font-bold">
              <p
                className={`${
                  chartData.increase > 0
                    ? "text-[limeGreen]"
                    : chartData.increase == 0
                    ? "text-accent"
                    : "text-[tomato]"
                } text-base lg:text-xl`}
              >
                {chartData?.increase?.toFixed(1) || 0}%
              </p>
              <p className="text-sm">this month</p>
            </div>
          </div>
        </div>
        {/* Background overlay */}
        <div className="absolute overlay w-1/2 h-1/2 bottom-0 right-0 z-[0]">
          <div
            className="text-8xl blur-[100px] rounded-full aspect-square"
            style={{
              background: `linear-gradient(35deg, ${data.color} 80%, ${data.color} 10%)`,
            }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
