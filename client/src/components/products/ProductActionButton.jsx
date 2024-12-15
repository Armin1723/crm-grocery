import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaEdit, FaEye } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ProductActionButton = ({ id }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const types = [
    {
      title: "edit",
      icon: FaEdit,
      clickHandler: () => navigate(`/products/${id}/edit`),
    },
    // {
    //   title: "view",
    //   icon: FaEye,
    // },
    {
      title: "set alert",
      icon: FaBell,
      clickHandler: () => navigate(`/products/${id}/alert`),
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
        className="button-title bg-[var(--color-card)] text-sm flex gap-2 items-center transition-all duration-300 ease-in rounded-md border border-neutral-500/50 px-3 py-1.5"
        tabIndex={0}
        role="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <HiDotsVertical />
      </div>

      {/* Dropdown Menu */}
      <div
        className={`${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } absolute menu overflow-hidden top-full -left-1/2 !z-[999] bg-[var(--color-card)] transition-all duration-300 ease-in min-w-[120px] rounded-md py-1 flex flex-col gap-2 border-neutral-500/50 border shadow-md`}
        role="menu"
        aria-hidden={!menuOpen}
      >
        {types.map((item) => (
          <div
            key={item?.title}
            className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              setMenuOpen(false);
              item.clickHandler();
            }}
          >
            <item.icon  />
            <p className="capitalize">{item?.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductActionButton;
