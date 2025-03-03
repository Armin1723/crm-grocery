import React from "react";
import { Outlet } from "react-router-dom";

const SellerEmployee = () => {
  return (
    <div className="flex flex-col rounded-md bg-[var(--color-sidebar)] select-none p-2 flex-1 w-full h-full gap-3 overflow-y-auto">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerEmployee;
