import { useState } from "react";

const HelpTooltip = ({ message, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Question Mark Icon */}
      <div
        className="cursor-pointer px-2 py-1 text-xs flex items-center justify-center rounded-md font-bold text-[var(--color-text-light)] bg-[var(--color-primary)] hover:bg-[var(--color-sidebar)] transition-all"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        ?
      </div>

      {/* Tooltip Content */}
      {isVisible && (
        <div
          className={`absolute whitespace-nowrap px-3 py-2 text-sm font-light bg-[var(--color-card)] text-[var(--color-text-light)] rounded-md shadow-md 
          ${position === "top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : ""} 
          ${position === "bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2" : ""}
          ${position === "left" ? "right-full mr-2 top-1/2 -translate-y-1/2" : ""}
          ${position === "right" ? "left-full ml-2 top-1/2 -translate-y-1/2" : ""}
          `}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
