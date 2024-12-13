import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { links } from "../utils";
import ReactDOM from "react-dom";
import { IoIosCloseCircle } from "react-icons/io";
import Avatar from "../utils/Avatar";
import { useSelector } from "react-redux";
import LogoutButton from "../utils/LogoutButton";

const NavSmall = () => {
  const pathname = useLocation().pathname;
  const [navOpen, setNavOpen] = useState(false);

  const navRef = useRef(null);
  const hamRef = useRef(null);

  const user = useSelector((state) => state.user);

  const Hamburger = () => {
    return (
      <div
        ref={hamRef}
        onClick={() => setNavOpen((prev) => !prev)}
        className="hidden max-sm:flex hamburger w-6 flex-col gap-1 mx-2"
      >
        <div className="line w-full border border-[var(--color-text)]"></div>
        <div className="line w-3/5 border border-[var(--color-text)]"></div>
        <div className="line w-4/5 border border-[var(--color-text)]"></div>
      </div>
    );
  };

  const SmallNav = () => {
    return ReactDOM.createPortal(
      <div
        ref={navRef}
        className={`nav ${
          navOpen ? "max-w-screen opacity-100" : "max-w-0 opacity-0"
        } fixed inset-0 w-4/5 !z-[999] 
     h-dvh flex border-r border-neutral-500/50 overflow-hidden flex-col py-6 bg-[var(--color-sidebar)] text-[var(--color-text)] transition-all duration-300 ease-in`}
      >
        <div className="top flex w-full justify-between px-4 relative pb-2 border-b border-neutral-500/50 ">
          <div className="top-sub flex items-center justify-between w-full gap-2">
            <div className="logo flex items-center gap-2">
              <p className="text-2xl font-bold">CRM - Grocery</p>
            </div>
            <div
              className="close cursor-pointer text-xl"
              onClick={() => setNavOpen(false)}
            >
              <IoIosCloseCircle />
            </div>
          </div>
        </div>
        <div className="links-container flex-1 mt-4 w-full ">
          <ul className="links min-h-[50px] max-h-[60vh] overflow-y-auto hide-scrollbar flex flex-col w-full ">
            {links.map((link, index) => {
              const isActive =
                link.to === "/"
                  ? pathname === link.to
                  : pathname.includes(link.to);

              return (
                <li key={index} className="link  w-full ">
                  <div
                    className={`actualLink flex justify-between items-center w-full ${
                      isActive
                        ? "border-l-4 border-accent bg-accent/10 pl-4"
                        : "pl-5"
                    } hover:bg-accent/5 transition-all duration-300 ease-in  `}
                  >
                    <Link
                      to={link.to}
                      onClick={() => {
                        setNavOpen(false);
                      }}
                      className="link relative flex flex-1 items-center gap-4 py-2 group "
                    >
                      <div
                        className={`icon ${isActive && "text-accent"}
                   
                transition-all duration-300 ease-in`}
                      >
                        <link.icon />
                      </div>
                      <p
                        className={`
                   overflow-hidden transition-all duration-300 ease-in group-hover:text-accent ${
                     isActive && "text-accent font-bold"
                   }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bottom flex justify-between gap-1 cursor-pointer items-center border-t border-neutral-500/50 pt-4 px-4">
          <div className="pofile flex items-center gap-2">
            <Avatar image={user?.avatar} />
            <p
              className={` overflow-hidden transition-all duration-300 ease-in flex flex-col`}
            >
              <span className="font-semibold">{user?.name}</span>
              <span className="font-light text-xs">{user?.uuid}</span>
            </p>
          </div>
          <LogoutButton expanded={false} />
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <Hamburger />
      <SmallNav />
    </>
  );
};

export default NavSmall;
