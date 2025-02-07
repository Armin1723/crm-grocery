import React from "react";
import ThemeToggle from "../utils/ThemeToggle";
import NavSmall from "./NavSmall";
import { useSelector } from "react-redux";
import FullScreenToggle from "../utils/FullScreenToggle";
import SettingsButton from "../utils/SettingsButton";

const TopRibbon = ({ pageRef }) => {
  const user = useSelector((state) => state.user);
  return (
    <div className="flex justify-between items-center w-full p-2 bg-[var(--color-sidebar)] py-4 px-12 max-lg:px-6 max-sm:px-3 border-b border-neutral-500/50">
      <div className="left flex items-center gap-2">
        <NavSmall />
        <p className="text-xl">
          Welcome <span className="font-semibold capitalize">{user?.name}</span>{" "}
          <span className="max-sm:hidden">to the CRM dashboard</span>
        </p>
      </div>
      <div className="right flex items-center justify-center gap-3">
        <FullScreenToggle pageRef={pageRef}/>
        <ThemeToggle />
        <SettingsButton />
      </div>
    </div>
  );
};

export default TopRibbon;
