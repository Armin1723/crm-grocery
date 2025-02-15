import React, { useState } from "react";
import { toast } from "react-toastify";

const LeadStatusForm = ({
  lead = {},
  closeModal = () => {},
  setRefetch = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const statusOptions = {
    new: ["open"],
    open: ["contacted"],
    contacted: ["converted", "lost"],
  };

  const updateStatus = async (id, status) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to change the status to "${status}"?`
    );
    if (!confirmUpdate) return;

    const notifId = toast.loading("Updating status...");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/leads/${id}/status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      toast.update(notifId, {
        render: data.message || "Status updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setRefetch();
      closeModal();
    } catch (error) {
      toast.update(notifId, {
        render: error.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <p className="capitalize">
        Current Status:{" "}
        <strong
          className={`${
            lead?.status === "new"
              ? "bg-accent/10 border-accent text-accent"
              : lead?.status === "open"
              ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
              : lead?.status === "contacted"
              ? "bg-blue-500/10 border-blue-500 text-blue-500"
              : lead?.status === "converted"
              ? "bg-green-500/10 border-green-500 text-green-500"
              : "bg-red-500/10 border-red-500 text-red-500"
          } px-3 rounded-lg text-xs py-0.5`}
        >
          {lead.status}
        </strong>
      </p>
      <div className="flex items-center gap-2">
        {statusOptions[lead.status]?.map((option) => (
          <button
            key={option}
            disabled={loading}
            className={`bg-accent disabled:cursor-not-allowed disabled:opacity-40 hover:bg-accentDark ${
              option === "lost" &&
              "bg-red-600/20 border-red-600 hover:bg-red-600/40 text-red-600"
            } text-white px-4 py-2 rounded-md transition-all duration-300 w-full`}
            onClick={() => updateStatus(lead._id, option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeadStatusForm;
