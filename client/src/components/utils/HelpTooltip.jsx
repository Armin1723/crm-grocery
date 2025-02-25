import { useState } from "react";
import { FaQuestion } from "react-icons/fa";

const HelpTooltip = ({ icon: Icon = null, message, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block mx-1">
      {/* Question Mark Icon */}
      <div
        className="cursor-pointer px-2 py-1 text-xs flex items-center justify-center rounded-md font-bold text-[var(--color-text-light)] bg-[var(--color-sidebar)] hover:bg-[var(--color-primary)] hover:shadow-md transition-all"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {Icon ? <Icon /> : <FaQuestion />}
      </div>

      {/* Tooltip Content */}
      {isVisible && (
        <div
          className={`absolute whitespace-nowrap px-3 py-2 text-xs font-semibold bg-[var(--color-card)] text-[var(--color-text-light)] rounded-md shadow-lg 
          ${
            position === "top"
              ? "bottom-full mb-1 -left-full -translate-x-1/2"
              : ""
          } 
          ${
            position === "bottom"
              ? "top-full mt-1 -left-full -translate-x-1/2"
              : ""
          }
          ${
            position === "left"
              ? "right-full mr-1 top-1/2 -translate-y-1/2"
              : ""
          }
          ${
            position === "right"
              ? "left-full ml-1 top-1/2 -translate-y-1/2"
              : ""
          }
          `}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
