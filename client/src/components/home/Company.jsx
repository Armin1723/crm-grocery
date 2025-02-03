import React from "react";
import { Outlet } from "react-router-dom";

const Company = () => {
  return (
    <div className="flex-1 overflow-y-scroll flex flex-col p-3 w-full bg-[var(--color-card)] rounded-lg">
        <div className="flex-1 overflow-y-auto px-2 ">
          <Outlet />
        </div>
    </div>
  );
};

export default Company;
