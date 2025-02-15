import React, { useEffect, useState, useRef } from "react";
import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import { formatDate } from "../utils";
import { io } from "socket.io-client";

const Notifications = () => {
  const [leads, setLeads] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState({});
  const menuRef = useRef(null);

  const socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
  });

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/leads?status=new`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    socket.on("new-lead", ()=>{
      fetchLeads();
    });
    socket.on("status-change", ()=>{
      fetchLeads();
    });
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to update lead status to "open"
  const markAsOpen = async (leadId) => {
    setLoading((prev) => ({ ...prev, [leadId]: true }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/leads/${leadId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "open" }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchLeads();
        l;
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [leadId]: false }));
    }
  };

  return (
    <div className="relative">
      {/* Notification Icon */}
      <div
        className="cursor-pointer relative"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IoMdNotifications className="text-2xl hover:fill-accentDark transition-all duration-300 ease-in" />
        {leads.length > 0 && (
          <div className="absolute bg-red-500 rounded-full p-1.5 -top-1 h-2 w-2 text-[0.5rem] text-white flex items-center justify-center right-0">
            {leads.length}
          </div>
        )}
      </div>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-72 bg-[var(--color-card)] shadow-lg rounded-lg border border-neutral-500/50 z-50"
        >
          <div className="p-3 text-sm font-semibold text[var(--color-text)] border-b border-neutral-500/50">
            New Leads
          </div>
          {leads.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {leads.map((lead) => (
                <li
                  key={lead._id}
                  className="p-2 flex justify-between items-center text-sm text-[var(--color-text-light)] border-b border-neutral-500/50"
                >
                  <Link
                    to={`/leads/${lead._id}`}
                    className="hover:underline flex-1"
                  >
                    <span className="font-semibold">{lead.phone}</span> new lead
                    on{" "}
                    <span className="font-semibold">
                      {formatDate(lead.createdAt)}
                    </span>
                  </Link>
                  <button
                    onClick={() => markAsOpen(lead._id)}
                    disabled={loading[lead._id]}
                    className={`ml-2 text-xs px-2 py-1 rounded ${
                      loading[lead._id]
                        ? "bg-gray-400"
                        : "bg-accent hover:bg-accentDark"
                    } text-white`}
                  >
                    {loading[lead._id] ? "Updating..." : "Mark Open"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-sm text-gray-500">No new leads</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
