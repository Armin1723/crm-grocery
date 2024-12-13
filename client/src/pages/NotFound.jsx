import React from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "2rem",
      }}
      className="bg-[var(--color-primary)] text-[var(--color-text)]"
    >
      <div style={{ textAlign: "center" }} className="flex flex-col items-center justify-center">
        <h1 className="text-6xl text-accentDark font-extrabold">404</h1>
        <h2 className="my-4 text-4xl max-lg:text-2xl max-sm:text-xl font-bold">
          Oops! Page not found.
        </h2>
        <div className="text-lg my-2">
          The page you are looking for doesn't exist or has been moved.
        </div>
        <Link
          to="/"
          className="bg-accent hover:bg-accentDark text-white px-6 py-2 my-2 text-bold rounded-md transition flex items-center gap-2"
        >
          <p>Go Back Home</p>
          <FaHome />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
