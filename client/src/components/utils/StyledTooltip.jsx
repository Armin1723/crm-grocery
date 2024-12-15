import React, { useState } from "react";
import ReactDOM from "react-dom";

const StyledTooltip = ({ text, tooltip, otherClasses = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const toggleTooltip = (e) => {
    setShowTooltip((prev) => !prev);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 10, // Adjust for vertical offset
      left: rect.left + rect.width / 2, // Center horizontally
    });
  };

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 10,
      left: rect.left + rect.width / 2,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      {/* Target Element */}
      <div
        className={`relative truncate text-ellipsis ${otherClasses}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleTooltip}
        onTouchStart={toggleTooltip}
      >
        <p className="cursor-pointer text-ellipsis truncate" aria-label={tooltip}>
          {text}
        </p>
      </div>

      {/* Tooltip */}
      {showTooltip &&
        ReactDOM.createPortal(
          <div
            className="fixed px-3 py-1 select-none rounded-md text-sm shadow-lg bg-[var(--bg-primary)] text-[var(--text-color)] transition-opacity duration-200 transform -translate-x-1/2 z-[999]"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
            onMouseEnter={() => setShowTooltip(true)} 
            onMouseLeave={() => setShowTooltip(false)} 
          >
            {tooltip}
          </div>,
          document.body
        )}
    </>
  );
};

export default StyledTooltip;
