import React from "react";
import Cards from "./Cards";
import CategoryChart from "./CategoryChart";
import SalesChart from "./SalesChart";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";

const Stats = () => {

  return (
    <div className="flex-1 h-full overflow-y-scroll flex flex-col px-2 w-full">
      <div className="line-1 flex w-full ">
        <Cards />
      </div>
      <div className="line-2 flex flex-1 gap-3 max-sm:flex-col-reverse px-3 py-2 my-2">
        <SalesChart />
        <div className="col w-1/4 max-sm:w-full flex flex-col max-sm:flex-col-reverse gap-4">
          <CategoryChart />
          <div className="flex-1 flex flex-col gap-3 rounded-md border border-neutral-500/50 bg-[var(--color-sidebar)] px-4 py-2">
          <p className="font-bold text-xl max-lg:text-lg">Add New Sale</p>
          <Link to='/sales/add' className="py-1.5 px-4 mb-1 rounded-md bg-accent hover:bg-accentDark transition-all duration-300 flex items-center justify-center text-white gap-2">Go To Sales <FaChartLine/></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
