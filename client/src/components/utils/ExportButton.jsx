import React, { useState, useEffect, useRef } from "react";
import {
  FaFileCsv,
  FaFileExcel,
  FaFileExport,
  FaFilePdf,
} from "react-icons/fa";

const ExportButton = ({title = "", params = ""}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const types = [
    {
      title: "PDF",
      icon: FaFilePdf,
      color: "crimson",
    },
    {
      title: "Excel",
      icon: FaFileExcel,
      color: "green",
    },
    {
      title: "CSV",
      icon: FaFileCsv,
      color: "seaGreen",
    },
  ];

  const handleExport = async (type) => {
    try {
      setMenuOpen(false);
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/${title}/export?fileType=${type.toLowerCase()}&category=${params}`, {
        // credentials: "include",
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("An error occurred while exporting data");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}${params !== '' ? '-' + params : ''}-${type}`;
      a.click();
    } catch (error) {
      console.error(error);
    }
  };

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
      className="relative flex items-center bg-[var(--bg-card)] px-4 py-2 rounded-md gap-2 cursor-pointer"
    >
      {/* Button */}
      <div
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter") toggleMenu();
        }}
        className="button-title hover:text-[var(--accent-color)] text-sm flex gap-2 items-center transition-all duration-300 ease-in"
        tabIndex={0}
        role="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <p>Export</p>
        <FaFileExport />
      </div>

      {/* Dropdown Menu */}
      <div
        className={`${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } absolute menu overflow-hidden top-full z-[99] bg-[var(--bg-card)] transition-all duration-300 ease-in w-[100px] rounded-md py-1 flex flex-col gap-2 border-neutral-500/90 border shadow-md`}
        role="menu"
        aria-hidden={!menuOpen}
      >
        {types.map((item) => (
          <div
            key={item?.title}
            className="menu-item px-4 py-1 text-sm text-center hover:bg-accent/70 hover:text-white cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") alert(`Exporting as ${item?.title}`);
            }}
            onClick={() => handleExport(item?.title)}
          >
            <item.icon color={item?.color} />
            <p>{item?.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportButton;
