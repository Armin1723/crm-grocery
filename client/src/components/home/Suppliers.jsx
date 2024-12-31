import React from "react";
import ChipNav from "../utils/ChipNav";
import { FaPlus, FaStore } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const Suppliers = () => {
  const navData = [
    {
      label: "View Suppliers",
      icon: FaStore,
      to: "/suppliers",
    },
    {
      label: "Add Supplier",
      icon: FaPlus,
      to: "/suppliers/add",
    },
  ];
  return (
    <div className="flex-1 overflow-y-scroll flex flex-col p-3 w-full">
      <ChipNav chips={navData} baseUrl="/suppliers" />
      <div className="flex-1 flex w-full max-lg:flex-col gap-3 ">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
