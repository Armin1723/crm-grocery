import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ChipNav = ({ chips, baseUrl = "/" }) => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  // Check if there's a history stack (i.e., can go back)
  const canGoBack = window.history.length > 1;

  return (
    <div className="flex gap-2 justify-start items-start p-3 bg-[var(--color-primary)] h-fit w-full select-none">
      <div className="wrapper flex gap-2 justify-start items-start w-full overflow-x-auto">
        {/* Leading chip for going back */}
        {canGoBack && (
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="px-3 py-1.5 bg-[var(--color-sidebar)] rounded-full text-sm flex items-center gap-2 h-fit w-fit hover:bg-accent/10 border border-neutral-500/30 transition-all duration-300 ease-in"
          >
            <span className="text-accent">←</span>
            <p>Back</p>
          </button>
        )}

        {/* Chips navigation */}
        {chips.map((chip, index) => {
          const isActive =
            chip.to === baseUrl ? pathname === chip.to : pathname === chip.to;
          return (
            <Link
              key={index}
              to={chip.to}
              className={`px-3 py-1.5 ${
                isActive ? "bg-accent/20" : "bg-[var(--color-sidebar)]"
              } rounded-full text-sm flex flex-shrink-0 items-center gap-2 h-fit w-fit hover:bg-accent/10 border border-neutral-500/30 transition-all duration-300 ease-in`}
            >
              <chip.icon className="text-accent" />
              <p>{chip.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ChipNav;
