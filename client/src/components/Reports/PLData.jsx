import React, { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Divider from "../utils/Divider";
import CountUp from "react-countup";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1919",
  "#19FFB1",
  "#FF19E7",
  "#19B3FF",
  "#FF195E",
];

const PLData = ({ reportData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-[var(--color-card)] rounded-lg p-6 shadow-sm">
        <Divider title={<p className="text-md md:text-xl">Sales Overview</p>} />

        <div className="sales-chart flex flex-col items-center justify-center md:flex-row gap-6">
          {/* Sales Data */}
          <div className="flex flex-col gap-3 flex-1 w-full">
            <div className="bg-[var(--color-primary)] p-4 rounded-lg">
              <h3 className="text-sm text-[var(--color-text-light)]">
                Total Sales
              </h3>
              <CountUp
                className="text-2xl font-bold text-green-500"
                end={reportData?.sales?.sales}
                duration={2}
                separator=","
                decimals={2}
                prefix="₹"
              />
            </div>

            <div className="bg-[var(--color-primary)] p-4 rounded-lg">
              <h3 className="text-sm text-[var(--color-text-light)]">
                Returns
              </h3>
              <CountUp
                className="text-2xl font-bold text-red-500"
                end={reportData?.sales?.returns}
                duration={2}
                separator=","
                decimals={2}
                prefix="₹"
              />
            </div>

            <div className="bg-[var(--color-primary)] p-4 rounded-lg">
              <h3 className="text-sm text-[var(--color-text-light)]">
                Net Sales
              </h3>
              <CountUp
                className={`text-2xl font-bold ${
                  reportData?.sales?.netSales >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
                end={reportData?.sales?.netSales}
                duration={2}
                separator=","
                decimals={2}
                prefix="₹"
              />
            </div>
          </div>

          {/* Pie Chart */}
          {reportData?.charts?.salesByCategory?.length > 0 && (
            <div className="bg-[var(--color-card)] rounded-lg shadow p-6 w-full md:w-1/2 h-full">
              <ResponsiveContainer
                width="100%"
                height={300}
                style={{ overflow: "visible" }}
              >
                <PieChart>
                  <Pie
                    data={reportData?.charts?.salesByCategory}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                    onMouseEnter={() => setActiveIndex((_, index) => index)}
                  >
                    {reportData?.charts?.salesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={
                          index === activeIndex
                            ? COLORS[index % COLORS.length]
                            : "none"
                        }
                        strokeWidth={index === activeIndex ? 2 : 0.5}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-primary)",
                      borderRadius: "8px",
                      border: "none",
                      color: "var(--color-text)",
                      padding: "10px",
                    }}
                    itemStyle={{
                      fontSize: "14px",
                      lineHeight: "1",
                      color: "var(--color-text)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legends */}
              <div className="w-full justify-center max-sm:justify-start flex overflow-x-auto items-start max-sm:items-start space-x-2">
                {reportData?.charts?.salesByCategory.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 shrink-0"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                    <p className="text-sm font-medium text-[var(--color-text-light)] capitalize">
                      {entry.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-card)] rounded-lg p-6 shadow-sm">
        <Divider
          title={<p className="text-md md:text-xl">Expenses Overview</p>}
        />

        <div className="expense-chart flex flex-col items-center justify-center md:flex-row gap-6">
          {/* Expense Data */}
          <div className="flex flex-col gap-3 flex-1 w-full">
            <div className="bg-[var(--color-primary)] p-4 rounded-lg">
              <h3 className="text-sm text-[var(--color-text-light)]">
                Purchases
              </h3>
              <CountUp
                className="text-2xl font-bold"
                end={reportData?.expenses?.purchases}
                duration={2}
                separator=","
                decimals={2}
                prefix="₹"
              />
            </div>

            <div className="bg-[var(--color-primary)] p-4 rounded-lg">
              <h3 className="text-sm text-[var(--color-text-light)]">
                Other Expenses
              </h3>
              <CountUp
                className="text-2xl font-bold"
                end={reportData?.expenses?.otherExpenses}
                duration={2}
                separator=","
                decimals={2}
                prefix="₹"
              />
            </div>

            <div className="bg-[var(--color-primary)] p-4 rounded-lg">
              <h3 className="text-sm text-[var(--color-text-light)]">
                Total Expenses
              </h3>
              <CountUp
                className="text-2xl font-bold text-red-500"
                end={reportData?.expenses?.total}
                duration={2}
                separator=","
                decimals={2}
                prefix="₹"
              />
            </div>
          </div>

          {/* Pie Chart */}
          {reportData?.charts?.expensesByCategory?.length > 0 && (
            <div className="bg-[var(--color-card)] rounded-lg shadow p-6 w-full md:w-1/2 h-full">
              <ResponsiveContainer
                width="100%"
                height={300}
                style={{ overflow: "visible" }}
              >
                <PieChart>
                  <Pie
                    data={reportData?.charts?.expensesByCategory}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                    onMouseEnter={() => setActiveIndex((_, index) => index)}
                  >
                    {reportData?.charts?.expensesByCategory.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={
                            index === activeIndex
                              ? COLORS[index % COLORS.length]
                              : "none"
                          }
                          strokeWidth={index === activeIndex ? 2 : 0.5}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-primary)",
                      borderRadius: "8px",
                      border: "none",
                      color: "var(--color-text)",
                      padding: "10px",
                    }}
                    itemStyle={{
                      fontSize: "14px",
                      lineHeight: "1",
                      color: "var(--color-text)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legends */}
              <div className="w-full justify-center max-sm:justify-start flex overflow-x-auto items-center max-sm:items-start space-x-2">
                {reportData?.charts?.expensesByCategory.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 shrink-0"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                    <p className="text-sm font-medium text-[var(--color-text-light)] capitalize">
                      {entry.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PLData;
