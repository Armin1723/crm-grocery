import React from "react";
import { FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NavAlt = ({ title }) => {
  const user = useSelector((state) => state.user);
  const homeLink = user ? (user.role === "admin" ? "/" : "/seller") : "/auth";
  return (
    <div className="flex w-full items-center justify-center sticky top-0 z-10 py-2 border-b border-neutral-500/50 bg-[var(--color-primary)] shadow-xl shadow-gray-500/20">
      <Link
        to={homeLink}
        className="text-sm font-bold text-accent absolute top-1/2 -translate-y-1/2 left-4 flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-accent/20"
      >
        <FaHome />
        <span>Home</span>
      </Link>
      <div className="text-lg font-bold uppercase !text-[var(--color-text)]">{title}</div>
    </div>
  );
};

export default NavAlt;
