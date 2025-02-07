import React, { useState, useEffect, useRef } from "react";
import { FaPhoneAlt, FaBars } from "react-icons/fa";

const TitleBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [appVersion, setAppVersion] = useState("");
  const menuRef = useRef(null);

  // Fetch app version when the menu is opened
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (!isMenuOpen) {
      const version = window.electron.ipcRenderer.sendSync("get-app-version");
      setAppVersion(version);
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const minimizeWindow = () => {
    window.electron.ipcRenderer.send("minimize-window");
  };

  const maximizeWindow = () => {
    window.electron.ipcRenderer.send("maximize-window");
  };

  const closeWindow = () => {
    window.electron.ipcRenderer.send("close-window");
  };

  const openInBrowser = (url) => {
    window.electron.ipcRenderer.send("open-in-browser", url);
  };

  const checkUpdate = () => {
    window.electron.ipcRenderer.send("check-updates");
  };

  return (
    <div
      style={{
        WebkitAppRegion: "drag",
      }}
      className="flex items-center justify-between bg-gradient-to-br from-purple-600 to-violet-600 text-xs text-gray-300 z-[9999999] sticky top-0 w-full px-4 py-"
    >
      <img
        src="./pattern.png"
        alt="pattern"
        className="absolute w-1/4 right-0 object-cover h-full"
      />
      {/* App Title */}
      <div className="flex items-center gap-2 relative text-white">
        <img
          src="./logo.png"
          alt="logo"
          className="w-5 aspect-square inline-block py-1"
        />
        <p>CRM Grocery</p>
      </div>

      {/* Support Button */}
      <button className="px-2 py-1 focus:outline-none flex items-center gap-2 hover:text-white transition-all duration-500">
        <FaPhoneAlt />
        <p>Contact Us | +91 12345 67890</p>
      </button>

      {/* Window Control Buttons */}
      <div
        className="flex items-center relative font-semibold"
        style={{
          WebkitAppRegion: "no-drag",
        }}
      >
        {/* Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="w-6 aspect-square flex items-center justify-center hover:bg-gray-700 rounded focus:outline-none"
            title="Menu"
          >
            <FaBars />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div
              className="absolute top-8 -left-4 bg-[var(--color-card)] shadow-lg rounded-lg w-48 text-[var(--color-text-light)] py-2 z-[99]"
              style={{
                WebkitAppRegion: "no-drag",
              }}
            >
              <ul className="w-full">
                <li className="hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)] transition-all duration-200 ease-in my-1 py-1 px-2">
                  <button
                    onClick={() => {
                      openInBrowser("https://example.com/tutorials");
                      setIsMenuOpen(false);
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tutorials
                  </button>
                </li>
                <li className="hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)] transition-all duration-200 ease-in my-1 py-1 px-2">
                  <button
                    onClick={() => {
                      openInBrowser("https://example.com/privacy");
                      setIsMenuOpen(false);
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li className="hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)] transition-all duration-200 ease-in my-1 py-1 px-2">
                  <button
                    onClick={() => {
                      openInBrowser("https://example.com/help");
                      setIsMenuOpen(false);
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Help
                  </button>
                </li>
                <li className="hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)] transition-all duration-200 ease-in my-1 py-1 px-2">
                  <button
                    onClick={() => {
                      checkUpdate();
                      setIsMenuOpen(false);
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check for Updates 🔄
                  </button>
                </li>
                <li className="hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)] transition-all duration-200 ease-in my-1 py-1 px-2">
                  <p>Version : {appVersion || "Loading..."}</p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Minimize Button */}
        <button
          onClick={minimizeWindow}
          className="w-8 aspect-square flex items-center justify-center hover:bg-accentDark rounded focus:outline-none"
          title="Minimize"
        >
          —
        </button>

        {/* Maximize Button */}
        <button
          onClick={maximizeWindow}
          className="w-8 aspect-square flex items-center justify-center hover:bg-blue-700 rounded focus:outline-none"
          title="Maximize"
        >
          ☐
        </button>

        {/* Close Button */}
        <button
          onClick={closeWindow}
          className="w-8 aspect-square flex items-center justify-center hover:bg-red-600 rounded focus:outline-none"
          title="Close"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
