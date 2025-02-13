import React from "react";
import { IoMdNotifications } from "react-icons/io";

const Notifications = () => {
  return (
    <div className="cursor-pointer relative">
      <IoMdNotifications className="text-2xl hover:fill-accentDark transition-all duration-300 ease-in" />
      <div className="absolute bg-red-500 rounded-full p-1.5 -top-1 h-2 w-2 text-[0.5rem] text-white flex items-center justify-center right-0">
        3
      </div>
    </div>
  );
};

export default Notifications;
