import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const HoverCard = ({ title, children, to= "", otherClasses = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate position of hover card content
  useEffect(() => {
    if (isHovered && titleRef.current && contentRef.current) {
      const titleRect = titleRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      // Position content to the right of the title
      const x = titleRect.right + 8;

      // Center vertically relative to the title and account for page bottom and top with a margin
      const margin = 20;
      const y = Math.max(
        margin,
        Math.min(
          titleRect.top + (titleRect.height - contentRect.height) / 2,
          window.innerHeight - contentRect.height - margin
        )
      );

      setPosition({ x, y });
    }
  }, [isHovered]);

  if (isMobile) {
    return <Link to={to} className="">{title}</Link>;
  }

  return (
    <div className={`relative inline-block ${otherClasses}`}>
      <div
        ref={titleRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer inline-block "
      >
        {title}
      </div>

      {isHovered && (
        <div
          ref={contentRef}
          className="fixed z-[99] max-w-3xl"
          style={{
            top: position.y,
            left: position.x,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Triangle pointer - now on the left side */}
          <div
            className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 
            border-t-[8px] border-t-transparent
            border-b-[8px] border-b-transparent
            border-r-[8px] border-r-[var(--color-card)] "
          />

          {/* Content container */}
          <div
            className="rounded-lg z-[100] relative flex flex-col items-center justify-center max-h-[60vh] bg-[var(--color-card)] shadow-[0_0_20px_gray] !shadow-neutral-500/10 backdrop-blur-sm transition-all duration-200 ease-out opacity-100 translate-x-0 min-w-fit overflow-y-auto"
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverCard;
