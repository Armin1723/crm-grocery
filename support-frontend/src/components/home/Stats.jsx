import React from "react";
import Cards from "./Cards";
import LeadsChart from "./leadsChart";

const Stats = () => {
  return (
    <div className="flex-1 h-full flex flex-col px-2 w-full">
      <div className="line-1 flex w-full ">
        <Cards />
      </div>
      <div className="line-2 flex-1 px-3 py-2 my-2 w-full">
        <LeadsChart />
      </div>
    </div>
  );
};

export default Stats;
