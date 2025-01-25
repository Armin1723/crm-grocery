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
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
    </div>
  );
};

export default Suppliers;
