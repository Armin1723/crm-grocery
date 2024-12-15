import React from "react";
import { Link, useLocation } from "react-router-dom";

const ChipNav = ({ chips, baseUrl = '/' }) => {
    const pathname = useLocation().pathname;
  return (
    <div className="flex gap-2 justify-start items-start p-3 bg-[var(--color-primary)] ">
      {chips.map((chip, index) => {
        const isActive = chip.to === baseUrl ? pathname === chip.to : pathname.includes(chip.to);
        return (
          <Link
            key={index}
            to={chip.to}
            className={`px-3 py-1.5 ${isActive ? 'bg-accent/20' : 'bg-[var(--color-sidebar)]'} rounded-full text-sm flex items-center gap-2 h-fit w-fit hover:bg-accent/10 border border-neutral-500/30 transition-all duration-300 ease-in`}
          >
            <chip.icon className="text-accent" />
            <p>{chip.label}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default ChipNav;
