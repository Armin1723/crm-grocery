import React, { useEffect, useState } from "react";
import ChipNav from "../utils/ChipNav";
import { FaClock } from "react-icons/fa";
import { BsInboxesFill } from "react-icons/bs";
import { Outlet } from "react-router-dom";

const Inventory = () => {
  
  const chipData = [
    {
      label: "Inventory Details",
      icon: BsInboxesFill,
      to: "/inventory",
    },
    {
      label: "Expiring Soon",
      icon: FaClock,
      to: "/inventory/expiring",
    },
  ];

  return (
    <div className="flex flex-col m-2 rounded-md bg-[var(--color-sidebar)] select-none p-2 border border-neutral-500/50 flex-1 w-full overflow-y-auto">
      <ChipNav chips={chipData} baseUrl="/inventory" />
      <Outlet />
    </div>
  );
};

export default Inventory;
