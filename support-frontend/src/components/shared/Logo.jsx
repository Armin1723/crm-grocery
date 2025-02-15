import React from "react";
import Avatar from "../utils/Avatar";

const Logo = ({ expanded = true }) => {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <Avatar image="/logo.png" width={40} withBorder={false} />
      <p
        className={`${
          expanded ? "w-full" : "w-0"
        } text-xl font-semibold transition-all duration-200 ease-in`}
      >
        CRM Grocery
      </p>
    </div>
  );
};

export default Logo;
