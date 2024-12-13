import React from "react";
import { Link, useLocation } from "react-router-dom";

const ChipNav = ({ chips }) => {
    const pathname = useLocation().pathname;
  return (
    <div className="flex gap-2 overflow-x-scroll p-3 sticky top-0 bg-[var(--color-primary)]">
      {chips.map((chip, index) => {
        const isActive = chip.to === '/' ? pathname === chip.to : pathname.includes(chip.to);
        return (
          <Link
            key={index}
            to={chip.to}
            className={`px-4 py-1.5 ${isActive ? 'bg-accent/20' : 'bg-[var(--color-sidebar)]'} rounded-full text-sm flex h-fit w-fit hover:bg-accent/10 border border-neutral-500/30 transition-all duration-300 ease-in`}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
};

export default ChipNav;
