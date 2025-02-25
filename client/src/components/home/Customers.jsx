import React from "react";
import ChipNav from "../utils/ChipNav";
import { FaPlus, FaUser } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const Customers = () => {
  const navData = [
    {
      label: "View Customers",
      icon: FaUser,
      to: "/customers",
    },
    {
      label: "Add Customer",
      icon: FaPlus,
      to: "/customers/add",
    },
  ];
  return (
    <div className="flex-1 overflow-y-scroll flex flex-col p-3 w-full">
      <ChipNav chips={navData} baseUrl="/customers" />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
    </div>
  );
};

export default Customers;
