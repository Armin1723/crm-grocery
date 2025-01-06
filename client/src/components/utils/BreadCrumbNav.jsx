import React from "react";
import { MdHome } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const BreadCrumbNav = () => {
  const pathname = useLocation().pathname;

  const pathnames = pathname.split("/").filter((x) => x);
  return (
    <div className="flex w-full text-sm max-sm:text-xs justify-start items-center gap-2 font-sans breadcrumb-container px-12 max-lg:px-6 max-sm:px-3 py-3 bg-[var(--color-sidebar)]">
          <Link
            to="/"
            className="hover:text-accent transition-all duration-300 ease-in"
          >
            <MdHome />
          </Link>
      {pathnames.length > 0 && (
        <div className="breadcrumb flex items-center gap-2">
          <span>/</span>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return isLast ? (
              <span key={name} className="hover:text-accent cursor-pointer transition-all duration-300 ease-in capitalize text-nowrap">{name}</span>
            ) : (
              <span key={name}>
                <Link
                  to={routeTo}
                  className="hover:text-accent transition-all duration-300 ease-in capitalize text-nowrap"
                >
                  {name}
                </Link>
                <span className="pl-2">/</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BreadCrumbNav;
