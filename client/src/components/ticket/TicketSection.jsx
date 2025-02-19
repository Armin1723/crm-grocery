import React, { useState } from "react";
import TicketForm from "./TicketForm";
import ViewTickets from "./ViewTickets";

const TicketSection = ({ closeModal = () => {} }) => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="flex flex-col gap-6 rounded-lg overflow-y-auto relative">
      {/* Tabs */}
      <div className="flex border-b border-accent w-full">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-4 text-sm font-medium ${
            activeTab === "add"
              ? "border-b-2 text-accent border-accent"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Add Ticket
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`px-6 py-4 text-sm font-medium ${
            activeTab === "view"
              ? "border-b-2 text-accent border-accent"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Tickets
        </button>
      </div>

      {/* Content */}
      {activeTab === "add" ? (
        <TicketForm closeModal={closeModal} />
      ) : (
        <ViewTickets />
      )}
    </div>
  );
};

export default TicketSection;
