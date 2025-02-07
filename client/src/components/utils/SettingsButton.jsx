import React, { useState, useRef, useEffect } from "react";
import { MdSettings } from "react-icons/md";

const SettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative items-center flex flex-col ">
      {/* Settings Button */}
      <button
        onClick={() => {
            setIsOpen((prev) => !prev);
        }}
        className="rounded-full bg-[var(--color-card)] hover:bg-[var(--color-card-overlay)] focus:outline-none"
      >
        <MdSettings className="text-2xl" />
      </button>

      {/* Floating Settings Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-6 w-64 bg-[var(--color-card)] shadow-lg rounded-lg p-3 z-50"
        >
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>Enable 2FA</span>
              <input type="checkbox" className="cursor-pointer" />
            </li>            
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;
