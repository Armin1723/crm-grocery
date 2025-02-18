import React from "react";
import ChipNav from "../utils/ChipNav";
import { Outlet } from "react-router-dom";
import { FaTicketAlt, FaTimes } from "react-icons/fa";

const Tickets = () => {
  const chipData = [
    {
      to: "/tickets",
      label: "View Tickets",
      icon: FaTicketAlt,
    },
    {
      to: "/tickets/closed",
      label: "Closed Tickets",
      icon: FaTimes,
    }
  ];
  return (
    <div className="flex-1 overflow-y-scroll md:overflow-y-hidden flex flex-col p-3 w-full">
      <ChipNav chips={chipData} baseUrl="/tickets" />
      <div className="flex-1 flex w-full flex-col md:flex-row gap-3 overflow-y-auto ">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Tickets;
