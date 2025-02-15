import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserCard from "../user/UserCard";
import { formatDate, formatDateIntl } from "../utils";
import Divider from "../utils/Divider";
import LeadActions from "./LeadActions";

const LeadDetails = () => {
  const [lead, setLead] = useState({});
  const [refetch, setRefetch] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/leads/${id}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Something went wrong");
        }
        setLead(data.lead);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchLead();
  }, [id, refetch]);

  return (
    <div className="w-full flex flex-col px-4 bg-[var(--color-card)] text-[var(--color-text)] p-2 rounded-lg">
      <Divider title="Lead Details" />
      {/* Lead Card */}
      <div className={`p-6 w-full rounded-lg shadow-lg  mx-auto `}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold capitalize">
              {lead?.name || "Unknown"}
            </h2>
            <p className="text-sm">{lead?.email || "Not provided"}</p>
          </div>
          <div className="flex items-center">
            <p
              className={`text-xs px-3 py-1 inline-block rounded-full font-semibold capitalize text-white ${
                lead?.status === "new"
                  ? "bg-accent"
                  : lead?.status === "open"
                  ? "bg-yellow-500"
                  : lead?.status === "contacted"
                  ? "bg-blue-500"
                  : lead?.status === "converted"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {lead?.status || "Unknown"}
            </p>
            <LeadActions lead={lead} setRefetch={setRefetch} />
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-[var(--color-text-light)] opacity-20" />

        {/* Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <span className="font-semibold text-[var(--color-text-light)]">
              Phone:
            </span>{" "}
            {lead?.phone || "Not provided"}
          </p>
          {lead?.dob && (
            <p>
              <span className="font-semibold text-[var(--color-text-light)]">
                Date of Birth:
              </span>{" "}
              {formatDateIntl(lead?.dob) || "-"}
            </p>
          )}
        </div>

        <div>
          {lead?.description && (
            <p className="mt-3 text-sm">
              <span className="font-semibold text-[var(--color-text-light)]">
                Description:
              </span>{" "}
              {lead?.description}
            </p>
          )}
        </div>
      </div>

      {/* Timeline Section */}
      {lead.timeline && lead.timeline.length > 0 && (
        <div className="mt-6">
          <Divider title="Activity Timeline" />
          <div className="mt-4 space-y-4 border-l-2 border-[var(--color-text-light)] pl-4">
            {lead.timeline.map((event, index) => (
              <div key={index} className="relative flex items-center gap-2">
                <div className="top-1 w-2 h-2 bg-[var(--color-accent)] rounded-full"></div>
                <p className="text-sm text-[var(--color-text-light)]">
                  {event.description} -{" "}
                  <span className="font-medium">{formatDate(event.on)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assigned User Section */}
      {lead.assignedTo && (
        <div className="mt-6">
          <Divider title="Assigned To" />
          <UserCard user={lead?.assignedTo} />
        </div>
      )}
    </div>
  );
};

export default LeadDetails;
