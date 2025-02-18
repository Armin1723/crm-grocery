import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FaTicketAlt, FaUsers } from "react-icons/fa";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const TICKET_COLORS = {
  new: "#3B82F6", // blue-500
  open: "#F59E0B", // yellow-500
  "in progress": "#10B981", // green-500
  closed: "#6B7280", // gray-500
};

const LEAD_COLORS = {
  new: "#3B82F6", // blue-500
  open: "#F59E0B", // yellow-500
  contacted: "#FBBF24", // amber-400
  converted: "#10B981", // green-500
  lost: "#DC2626", // red-500
};

const StatCard = ({ title, total, data, colors, icon: Icon }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: colors[name.toLowerCase()],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--color-sidebar)] rounded-xl shadow-lg p-3 px-8 w-full flex flex-col justify-between md:flex-row gap-4"
    >
      {/* Left side - Total */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-accent/30">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-lg lg:text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex items-baseline gap-2 justify-between px-3">
          <div className="flex gap-2 items-baseline">
            <span className="text-[var(--color-text-light)]">Total</span>
            <span className="text-4xl font-bold">
              <CountUp end={total} duration={2} />
            </span>
          </div>
          <Link
            to={`/${title.split(" ")[0].toLowerCase()}`}
            className="text-xs hover:underline text-accent hover:text-accentDark transition-all duration-300"
          >
            ... View All
          </Link>
        </div>
      </div>

      {/* Right side - Chart */}
      <div className="flex-1 min-h-[150px] flex flex-col justify-end">
        <ResponsiveContainer width="100%" height="99%">
          <BarChart data={chartData} key={chartData?.length} barGap={20}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              interval={0}
            />

            <YAxis hide={true} domain={[0, "dataMax + 1"]} />
            <Tooltip
              cursor={{ fill: "var(--color-card-overlay)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[var(--color-card)] px-3 py-2 rounded-lg shadow-lg border border-accent/10">
                      <p className="text-xs md:text-sm">
                        {payload[0].payload.name}:{" "}
                        <span className="">{payload[0].value}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const Cards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/stats`,
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="w-full p-3">
      <div className="flex items-center justify-between max-lg:flex-wrap gap-6">
        <StatCard
          title="Tickets Overview"
          total={stats?.tickets[0]?.total}
          data={stats.ticketStatus || {}}
          colors={TICKET_COLORS}
          icon={FaTicketAlt}
        />
        <StatCard
          title="Leads Overview"
          total={stats?.leads[0]?.total}
          data={stats.leadStatus || {}}
          colors={LEAD_COLORS}
          icon={FaUsers}
        />
      </div>
    </div>
  );
};

export default Cards;
