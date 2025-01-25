import React, { useEffect, useState } from "react";
import Avatar from "../utils/Avatar";
import { MdChevronRight } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutButton from "../utils/LogoutButton";
import { links } from "../utils";
import HoverCard from "./HoverCard";
import EmployeeCard from "../employee/EmployeeCard";

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const [expanded, setExpanded] = useState(true);
  const pathname = useLocation().pathname;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setExpanded(false);
      else setExpanded(true);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`nav text-sm max-sm:hidden sticky top-0 z-[90] select-none ${
        expanded
          ? "min-w-[17%] max-w-[20%]"
          : "min-w-[5%] max-lg:min-w-[8%] max-w-[5%]"
      } h-screen flex  border-r border-neutral-500/50 flex-col py-3 bg-[var(--color-sidebar)] text-[var(--color-text)] transition-all duration-300 ease-in`}
    >
      <div className="top flex items-center w-full justify-between px-4 relative py-2 border-b border-neutral-500/50">
        <div className="logo flex items-center justify-start ">
          <p className="text-2xl font-bold">
            CRM{" "}
            <span className={`${!expanded && "hidden"} max-md:hidden`}>
              - Grocery{" "}
            </span>
          </p>
        </div>

        <button
          onClick={() => setExpanded((prev) => !prev)}
          className={`absolute top-1/2 -translate-y-1/2 !z-[99] right-0 translate-x-1/2 p-2 bg-[var(--color-primary)] border border-neutral-500/90 hover:shadow-md hover:bg-opacity-75 rounded-full ${
            expanded ? "rotate-180" : "scale-75 origin-center"
          } transition-all duration-300 ease-in`}
        >
          <MdChevronRight />
        </button>
      </div>
      <div className="links-container flex-1 mt-4">
        <ul className="links min-h-[50px] max-h-[60vh] overflow-y-auto hide-scrollbar">
          {links.map((link, index) => {
            const isActive =
              link.to === "/"
                ? pathname === link.to
                : pathname.startsWith(link.to);

            return (
              <div key={index} className={`link ${user && user?.role !== "admin" && link.protected && "hidden"}`}>
                <Link
                  to={user?.role == 'admin' ? link.to : `/seller${link.to}`}
                  title={link.title}
                  className={`link flex items-center gap-4 py-2 group hover:bg-accent/5 transition-all relative duration-300 ease-in group ${
                    !expanded && "justify-start gap-2 "
                  } ${
                    isActive
                      ? "border-l-4 border-accent bg-accent/10 px-4"
                      : "px-5"
                  }`}
                >
                  <div
                    className={`icon ${isActive && "text-accent"} ${
                      !expanded && "text-xl my-1"
                    } transition-all duration-300 ease-in group-hover:text-accent/80`}
                  >
                    <link.icon />
                  </div>
                  <p
                    className={`${
                      expanded ? "max-w-full" : "max-w-0"
                    } overflow-hidden transition-all duration-300 ease-in group-hover:text-accent ${
                      isActive && "text-accent font-bold"
                    }`}
                  >
                    {link.title}
                  </p>
                </Link>
              </div>
            );
          })}
        </ul>
      </div>

      <div className="bottom flex flex-col gap-1 cursor-pointer items-center border-t border-neutral-500/50 pt-4 px-4">
        <div className="pofile flex items-center gap-2">
          <HoverCard
            title={
              <Avatar image={user?.avatar} width={40} withBorder={false} />
            }
          >
            <EmployeeCard employee={user} />
          </HoverCard>
          <p
            className={` ${
              expanded ? "max-w-full opacity-100" : "max-w-0 opacity-0"
            } overflow-hidden transition-all duration-300 ease-in flex flex-col capitalize`}
          >
            <span className="font-semibold">{user?.name}</span>
            <span className="font-light text-xs">{user?.uuid}</span>
          </p>
        </div>
        <LogoutButton expanded={expanded} />
      </div>
    </div>
  );
};

export default Sidebar;
