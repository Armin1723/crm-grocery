import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { links } from "../../utils";
import ReactDOM from "react-dom";
import { IoIosCloseCircle } from "react-icons/io";
import Avatar from "../../utils/Avatar";
import { useSelector } from "react-redux";
import LogoutButton from "../../utils/LogoutButton";
import HoverCard from "../../shared/HoverCard";
import EmployeeCard from "../../employee/EmployeeCard";
import Logo from "../../shared/Logo";
import { MdSettings } from "react-icons/md";

const SellerNavSmall = () => {
  const pathname = useLocation().pathname;
  const [navOpen, setNavOpen] = useState(false);

  const navRef = useRef(null);
  const hamRef = useRef(null);

  const user = useSelector((state) => state.user);

  const hasPermission = user?.permissions?.includes("companies") || false;

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

  return (
    <>
      {/* Hamburger */}
      <div
        ref={hamRef}
        onClick={() => setNavOpen((prev) => !prev)}
        className="flex hamburger w-10 flex-col gap-1 px-2 cursor-pointer transition-all duration-300 ease-in"
      >
        <div
          className={`line w-full border-b-2 transition-all duration-300 
          ${navOpen ? "rotate-45 translate-y-1.5" : ""} 
          border-[var(--color-text)]`}
        ></div>
        <div
          className={`line w-3/5 border-b-2 transition-all duration-300 
          ${navOpen ? "opacity-0" : ""} 
          border-[var(--color-text)]`}
        ></div>
        <div
          className={`line w-full border-b-2 transition-all duration-300 
          ${navOpen ? "-rotate-45 -translate-y-1.5" : ""} 
          border-[var(--color-text)]`}
        ></div>
      </div>
      {/* Small Nav */}
      {ReactDOM.createPortal(
        <div
          ref={navRef}
          className={`nav !z-[99999] fixed top-4 left-0
          h-full flex border-r border-neutral-500/50 flex-col 
          py-6 bg-[var(--color-sidebar)] text-[var(--color-text)] 
          transition-all duration-300 ease-in-out overflow-hidden
          ${navOpen ? "w-4/5 tab:w-2/5 md:w-1/3 lg:w-1/5" : "w-0"} `}
        >
          {/* Top Section */}
          <div className="top flex w-full justify-between px-4 relative pb-2 border-b border-neutral-500/50">
            <div className="top-sub flex items-center justify-between w-full gap-2">
              {hasPermission ? (
                <Logo />
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar
                    width={42}
                    image={user?.company?.logo}
                    withBorder={false}
                  />
                  <p
                    className={`text-lg font-bold transition-all duration-300 ease-in overflow-hidden `}
                  >
                    {user?.company?.name}
                  </p>
                </div>
              )}
              <div
                className="close cursor-pointer text-xl"
                onClick={() => setNavOpen(false)}
              >
                <IoIosCloseCircle />
              </div>
            </div>
          </div>

          {/* Links Container */}
          <div className="links-container flex-1 mt-4 w-full select-none text-sm">
            <ul className="links min-h-[50px] max-h-[60vh] overflow-y-auto hide-scrollbar flex flex-col w-full">
              {links.map((link, index) => {
                const isActive =
                  link.to === "/"
                    ? pathname === "/seller/"
                    : pathname.startsWith(`/seller${link.to}`);

                return (
                  <li
                    key={index}
                    className={`link ${
                      !user?.permissions?.includes(link.title.toLowerCase()) &&
                      link.to !== "/" &&
                      "hidden"
                    }`}
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
                      </div>
                    </div>
                  </li>
                );
              })}

              {/* Settings Icon */}
              <Link
                to="/seller/settings"
                onClick={() => setNavOpen(false)}
                className={`${
                  pathname.includes("/settings")
                    ? 'text-accent bg-accent/10 border-l-4 border-accent px-4' : 'px-5'
                } link flex items-center gap-4 py-1 group hover:bg-accent/5 transition-all relative duration-300 ease-in group `}
              >
                <div
                  className={`icon text-xl my-1 transition-all duration-300 ease-in group-hover:text-accent/80`}
                >
                  <MdSettings />
                </div>
                <p
                  className={`${pathname.includes('/settings') && 'font-bold'} overflow-hidden transition-all duration-300 ease-in group-hover:text-accent`}
                >
                  Settings
                </p>
              </Link>
            </ul>
          </div>

          {/* Bottom User Section */}
          <div
            onClick={() => setNavOpen(false)}
            className="bottom flex justify-between gap-1 cursor-pointer 
          items-center border-t border-neutral-500/50 pt-4 px-4 text-sm"
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
