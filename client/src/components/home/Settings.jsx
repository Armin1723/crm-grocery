import React from "react";
import ChipNav from "../utils/ChipNav";
import { Outlet } from "react-router-dom";

const Settings = () => {
  return (
    <div className="flex-1 h-full overflow-y-scroll flex flex-col p-3 w-full">
      <ChipNav chips={[]} baseUrl="/settings" />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
    </div>
  );
};

export default Settings;
