import React, { useEffect, useState } from "react";
import EmployeeCard from "../../employee/EmployeeCard";
import { useSelector } from "react-redux";
import SellerCategoryChart from "./SellerCategoryChart";
import SellerSalesChart from "./SellerSalesChart";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import { BsInboxesFill } from "react-icons/bs";
import CountUp from "react-countup";

const SellerHome = () => {
  const user = useSelector((state) => state.user);
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const fetchSellerStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/stats/seller`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setStats(data.stats);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSellerStats();
  }, []);

  return (
    <div className="flex flex-col rounded-md bg-[var(--color-sidebar)] select-none p-2 flex-1 w-full h-full gap-3 overflow-y-auto">
      <div className="line-1 flex flex-col lg:flex-row w-full gap-2">
        <div className="salesChart flex-1">
          <SellerSalesChart/>
        </div>
        <div className="w-full lg:w-1/4 h-full">
          <SellerCategoryChart />
        </div>
      </div>
      <div className="line-2 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* Sales Card */}
        <div className="flex flex-col justify-between rounded-lg border border-neutral-500/50 bg-[var(--color-primary)] p-5">
          <div className="flex items-center gap-4">
            <div className="bg-accent text-white rounded-full p-3">
              <FaChartLine />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Sales</h3>
              <p className="text-sm text-gray-500">
                Track, manage and add sales efficiently.
              </p>
            </div>
          </div>
          <div className="text-[var(--color-text-light)] pl-3 py-2">
            Your Sales Today:{" "}
            <CountUp
              end={stats?.totalSales}
              duration={3}
              separator=","
              prefix="₹"
              decimals={2}
              decimal="."
            />
          </div>
          <Link
            to="/seller/sales/add"
            className="mt-4 inline-flex items-center justify-center w-full py-2 px-4 rounded-md bg-accent hover:bg-accentDark text-white font-medium transition-colors"
          >
            Go to Sales
          </Link>
        </div>

        {/* Inventory Card */}
        <div className="flex flex-col justify-between rounded-lg border border-neutral-500/50 bg-[var(--color-primary)] p-5">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 text-white rounded-full p-3">
              <BsInboxesFill />
            </div>
            <div>
              <h3 className="text-lg font-semibold ">Inventory</h3>
              <p className="text-sm text-gray-500">
                Manage stock levels and product details.
              </p>
            </div>
          </div>
          <div className="text-[var(--color-text-light)] pl-3 py-2">
            Items in Inventory: <CountUp end={stats?.totalInventory} duration={3} />
          </div>
          <Link
            to="/seller/inventory"
            className="mt-4 inline-flex items-center justify-center w-full py-2 px-4 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
          >
            Go to Inventory
          </Link>
        </div>

        {/* Employee Card */}
        <div className="rounded-lg transition-shadow border border-neutral-500/50 max-lg:last:col-span-full">
          <EmployeeCard employee={user} otherClasses="h-full"/>
        </div>
      </div>
    </div>
  );
};

export default SellerHome;
