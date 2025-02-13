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

const TICKET_COLORS = {
  new: "#00CED1",
  open: "#4169E1",
  "in progress": "#FFA500",
  closed: "#808080",
};

const LEAD_COLORS = {
  new: "#2E8B57",
  contacted: "#800080",
  converted: "#4CAF50",
  lost: "#DC143C",
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
      className="bg-[var(--color-card)] rounded-xl shadow-lg p-3 px-8 w-full flex flex-col md:flex-row gap-6"
    >
      {/* Left side - Total */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-accent/30">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[var(--color-text-light)]">Total</span>
          <span className="text-4xl font-bold">
            <CountUp to={total} duration={2} />
          </span>
        </div>
      </div>

      {/* Right side - Chart */}
      <div className="flex-1 h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={20}>
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
                      <p className="text-sm font-medium">
                        {payload[0].payload.name}:{" "}
                        <span className="font-bold">{payload[0].value}</span>
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

  const totalTickets = Object.values(stats.ticketStatus).reduce(
    (a, b) => a + b,
    0
  );
  const totalLeads = Object.values(stats.leadStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full p-3">
      <div className="flex items-center justify-between max-lg:flex-wrap gap-6">
        <StatCard
          title="Tickets Overview"
          total={totalTickets}
          data={stats.ticketStatus}
          colors={TICKET_COLORS}
          icon={FaTicketAlt}
        />
        <StatCard
          title="Leads Overview"
          total={totalLeads}
          data={stats.leadStatus}
          colors={LEAD_COLORS}
          icon={FaUsers}
        />
      </div>
    </div>
  );
};

export default Cards;
