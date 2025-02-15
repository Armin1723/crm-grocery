import React from "react";
import { FaPlus } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import ChipNav from "../utils/ChipNav";
import { Outlet } from "react-router-dom";

const Leads = () => {
  const chipData = [
    {
      to: "/leads",
      label: "View Leads",
      icon: MdPersonSearch,
    },
    {
      to: "/leads/add",
      label: "Add Lead",
      icon: FaPlus,
    }
  ];
  return (
    <div className="flex-1 overflow-y-scroll md:overflow-y-hidden flex flex-col p-3 w-full">
      <ChipNav chips={chipData} baseUrl="/purchases" />
      <div className="flex-1 flex w-full flex-col md:flex-row gap-3 overflow-y-auto ">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Leads;
