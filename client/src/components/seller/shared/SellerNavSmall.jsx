import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { links } from "../../utils";
import ReactDOM from "react-dom";
import { IoIosCloseCircle, IoIosArrowUp } from "react-icons/io";
import Avatar from "../../utils/Avatar";
import { useSelector } from "react-redux";
import LogoutButton from "../../utils/LogoutButton";
import HoverCard from "../../shared/HoverCard";
import EmployeeCard from "../../employee/EmployeeCard";

const SellerNavSmall = () => {
  const pathname = useLocation().pathname;
  const [navOpen, setNavOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const navRef = useRef(null);
  const hamRef = useRef(null);

  const user = useSelector((state) => state.user);

  // Close nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        hamRef.current &&
        !hamRef.current.contains(event.target)
      ) {
        setNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSubmenu = (linkTitle) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [linkTitle]: !prev[linkTitle],
    }));
  };

  return (
    <>
      {/* Hamburger */}
      <div
        ref={hamRef}
        onClick={() => setNavOpen((prev) => !prev)}
        className="flex hamburger w-6 flex-col gap-1 mx-2 cursor-pointer transition-all duration-300 ease-in"
      >
        <div
          className={`line w-full border transition-all duration-300 
          ${navOpen ? "rotate-45 translate-y-1.5" : ""} 
          border-[var(--color-text)]`}
        ></div>
        <div
          className={`line w-3/5 border transition-all duration-300 
          ${navOpen ? "opacity-0" : ""} 
          border-[var(--color-text)]`}
        ></div>
        <div
          className={`line w-full border transition-all duration-300 
          ${navOpen ? "-rotate-45 -translate-y-1.5" : ""} 
          border-[var(--color-text)]`}
        ></div>
      </div>
      {/* Small Nav */}
      {ReactDOM.createPortal(
        <div
          ref={navRef}
          className={`nav fixed top-0 left-0 !z-[999] 
          h-dvh flex border-r border-neutral-500/50 flex-col 
          py-6 bg-[var(--color-sidebar)] text-[var(--color-text)] 
          transition-all duration-300 ease-in-out overflow-hidden
          ${navOpen ? "w-4/5 tab:w-2/5 md:w-1/3 lg:w-1/5" : "w-0"} `}
        >
          {/* Top Section */}
          <div className="top flex w-full justify-between px-4 relative pb-2 border-b border-neutral-500/50">
            <div className="top-sub flex items-center justify-between w-full gap-2">
              <div className="logo flex items-center gap-2">
                <p className="text-2xl font-bold">Logo</p>
              </div>
              <div
                className="close cursor-pointer text-xl"
                onClick={() => setNavOpen(false)}
              >
                <IoIosCloseCircle />
              </div>
            </div>
          </div>

          {/* Links Container */}
          <div className="links-container flex-1 mt-4 w-full select-none">
            <ul className="links min-h-[50px] max-h-[60vh] overflow-y-auto hide-scrollbar flex flex-col w-full">
              {links.map((link, index) => {
                const isActive =
                link.to === "/"
                ? pathname === '/seller/'
                : pathname.startsWith(`/seller${link.to}`)

                const hasSublinks = link.sublinks && link.sublinks.length > 0;
                const isSubmenuOpen = openSubmenus[link.title];

                return (
                  <li
                    key={index}
                    className={`link ${link.protected && "hidden"}`}
                  >
                    <div className="actualLink flex flex-col justify-between items-center w-full">
                      <div
                        className={`${
                          isActive
                            ? "bg-accent/10 border-l-4 border-accent pl-4"
                            : "pl-5"
                        } flex items-center justify-between w-full hover:bg-accent/5 
                      transition-all duration-300 ease-in`}
                      >
                        <Link
                          to={`/seller${link.to}`}
                          onClick={() => {
                            setNavOpen(false);
                            setOpenSubmenus({});
                          }}
                          className="link relative flex flex-1 items-center gap-4 py-2 group"
                        >
                          <div
                            className={`icon ${isActive && "text-accent"}
                          transition-all duration-300 ease-in group-hover:text-accent`}
                          >
                            <link.icon />
                          </div>
                          <p
                            className={`overflow-hidden transition-all duration-300 
                          ease-in group-hover:text-accent 
                          ${isActive && "text-accent font-bold"}`}
                          >
                            {link.title}
                          </p>
                        </Link>

                        {hasSublinks && (
                          <div
                            onClick={() => toggleSubmenu(link.title)}
                            className={`cursor-pointer p-2 ${
                              isSubmenuOpen && "transform rotate-180"
                            } transition-all duration-300`}
                          >
                            <IoIosArrowUp
                              className={` transition-all duration-300`}
                            />
                          </div>
                        )}
                      </div>

                      {hasSublinks && (
                        <ul
                          className={`w-full overflow-hidden ${
                            isSubmenuOpen ? "max-h-screen" : "max-h-0"
                          } transition-all duration-300 ease-in  
                        `}
                        >
                          {link.sublinks.map((sublink, subIndex) => {
                            const isSubActive =
                              pathname === `/seller${sublink.to}`;
                            return (
                              <li
                                key={`${index}-${subIndex}`}
                                className={`py-2 pl-8 transition-all duration-300 
                                ${
                                  isSubActive
                                    ? "text-accent font-bold bg-accent/10"
                                    : ""
                                }`}
                              >
                                <Link
                                  to={`/seller${sublink.to}`}
                                  onClick={() => {
                                    setNavOpen(false);
                                    setOpenSubmenus({});
                                  }}
                                  className="flex items-center gap-2 
                                  hover:text-accent transition-colors"
                                >
                                  {sublink.icon && (
                                    <sublink.icon
                                      className={`mr-2 overflow-hidden
                                    ${isSubActive ? "text-accent" : ""}`}
                                    />
                                  )}
                                  {sublink.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom User Section */}
          <div
            onClick={() => setNavOpen(false)}
            className="bottom flex justify-between gap-1 cursor-pointer 
          items-center border-t border-neutral-500/50 pt-4 px-4"
          >
            <div className="profile flex items-center gap-2">
              <HoverCard title={<Avatar width={42} image={user?.avatar} />}>
                <EmployeeCard employee={user} />
              </HoverCard>
              <p
                className="overflow-hidden transition-all duration-300 
              ease-in flex flex-col"
              >
                <span className="font-semibold capitalize">{user?.name}</span>
                <span className="font-light text-xs">{user?.uuid}</span>
              </p>
            </div>
            <LogoutButton expanded={false} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default SellerNavSmall;
