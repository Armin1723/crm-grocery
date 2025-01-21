import React from "react";
import ChipNav from "../utils/ChipNav";
import { FaPlus, FaUser } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const Employees = () => {
  const navData = [
    {
      label: "View Employees",
      icon: FaUser,
      to: "/employees",
    },
    {
      label: "Add Employee",
      icon: FaPlus,
      to: "/employees/add",
    },
  ];
  return (
    <div className="flex-1 overflow-y-scroll flex flex-col p-3 w-full">
      <ChipNav chips={navData} baseUrl="/employees" />
      <div className="flex-1 flex w-full max-lg:flex-col gap-3 ">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Employees;
