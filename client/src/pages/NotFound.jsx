import React from "react";
import { FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NotFound = () => {
  const user = useSelector((state) => state.user);
  return (
    <div
      className="bg-[var(--color-primary)] text-[var(--color-text)] h-full"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-[var(--color-text)] rounded-full shadow-xl animate-pulse aspect-square"
            style={{
              width: Math.random() * 7 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.8
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center justify-center mx-4 relative">
        {/* Astronaut SVG */}
        <svg
          className="w-64 h-64 mb-8 animate-float"
          viewBox="0 0 200 200"
          style={{
            animation: "float 6s ease-in-out infinite"
          }}
        >
          <style>
            {`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
              }
            `}
          </style>
          <g>
            {/* Back oxygen tank */}
            <rect x="85" y="110" width="30" height="45" rx="15" fill="#D1D5DB" />
            
            {/* Main spacesuit body */}
            <path
              d="M65 90c0-27.614 15.431-50 35-50s35 22.386 35 50c0 27.614-15.431 40-35 40s-35-12.386-35-40z"
              fill="#ffffff"
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Neck ring */}
            <ellipse cx="100" cy="70" rx="25" ry="10" fill="#D1D5DB" stroke="#374151" strokeWidth="2" />
            
            {/* Helmet */}
            <path
              d="M70 65c0-16.569 13.431-30 30-30s30 13.431 30 30"
              fill="#ffffff"
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Helmet dome */}
            <path
              d="M75 65c0-13.807 11.193-25 25-25s25 11.193 25 25"
              fill="none"
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Visor */}
            <path
              d="M80 65c0-11.046 8.954-20 20-20s20 8.954 20 20"
              fill="#A5F3FC"
              opacity="0.6"
            />
            
            {/* Arms */}
            <path
              d="M65 90c-10 15-15 25-15 35M135 90c10 15 15 25 15 35"
              fill="none"
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Hand gloves */}
            <circle cx="50" cy="125" r="8" fill="#ffffff" stroke="#374151" strokeWidth="2" />
            <circle cx="150" cy="125" r="8" fill="#ffffff" stroke="#374151" strokeWidth="2" />
            
            {/* Belt details */}
            <path
              d="M70 100h60"
              stroke="#374151"
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Suit details */}
            <path
              d="M90 80v30M110 80v30"
              stroke="#374151"
              strokeWidth="2"
              opacity="0.5"
            />
          </g>
        </svg>

        <h1 className="text-6xl text-accentDark font-extrabold">404</h1>
        <h2 className="my-4 text-4xl max-lg:text-2xl max-sm:text-xl font-bold">
          Looks like you're lost!
        </h2>
        <div className="text-lg my-2 text-center">
          The page you are looking for does not exist.
          <br />
          Let's get you back.
        </div>
        <Link
          to={user?.role === "admin" ? "/" : "/seller"}
          className="bg-accent hover:bg-accentDark text-white px-6 py-2 my-2 text-bold rounded-md transition flex items-center gap-2"
        >
          <p>Return to Home </p>
          <FaHome />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;