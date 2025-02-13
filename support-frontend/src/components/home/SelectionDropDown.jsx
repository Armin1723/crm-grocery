import React, { useState, useEffect, useRef } from "react";
import { GoChevronDown } from "react-icons/go";

const SelectionDropDown = ({ groupBy, setGroupBy }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const types = [
    {
      title: "daily",
    },
    {
      title: "weekly",
    },
    {
      title: "monthly",
    },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Toggle menu visibility
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div
      ref={menuRef}
      className="relative flex items-center px-4 py-2 rounded-md gap-2 cursor-pointer"
    >
      {/* Button */}
      <div
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter") toggleMenu();
        }}
        className="button-title bg-[var(--color-card)] text-xs md:text-sm flex gap-2 items-center transition-all duration-300 ease-in rounded-md border border-neutral-500/50 px-3 py-1"
        tabIndex={0}
        role="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <p className="capitalize">{groupBy}</p>
        <GoChevronDown />
      </div>

      {/* Dropdown Menu */}
      <div
        className={`${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } absolute menu overflow-hidden top-full z-[99] bg-[var(--color-card)] transition-all duration-300 ease-in w-[100px] rounded-md py-1 flex flex-col gap-2 border-neutral-500/50 border shadow-md`}
        role="menu"
        aria-hidden={!menuOpen}
      >
        {types.map((item) => (
          <div
            key={item?.title}
            className="menu-item px-4 py-1 text-xs md:text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              setGroupBy(item?.title);
              setMenuOpen(false);
            }}
          >
            <p className="capitalize">{item?.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectionDropDown;
