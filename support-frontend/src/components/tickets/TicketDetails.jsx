import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserCard from "../user/UserCard";
import Divider from "../utils/Divider";
import ClientCard from "../clients/ClientCard";
import TicketActions from "./TicketActions";

const TicketDetails = () => {
  const [ticket, setTicket] = useState({});
  const [client, setClient] = useState({});
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/tickets/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Something went wrong");
        }
        setTicket(data.ticket);
        setClient(data.client);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id, refetch]);

  return (
    <div className="w-full flex-1 h-full flex flex-col bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-lg overflow-y-auto">
      <Divider title="Ticket Details" />

      {ticket && !loading && (
        <>
          <div className={`p-6 w-full rounded-lg shadow-lg mx-auto`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-xl font-semibold capitalize">
                  {ticket?.title || "Untitled"}
                </h2>
                <p className="text-sm text-[var(--color-text-light)] my-1">Ticket ID: {ticket._id}</p>
              </div>
              <div className="flex items-center">
                <p
                  className={`text-xs px-3 py-1 inline-block rounded-full font-semibold capitalize text-white ${
                    ticket?.status === "new"
                      ? "bg-accent"
                      : ticket?.status === "open"
                      ? "bg-yellow-500"
                      : ticket?.status === "in progress"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                >
                  {ticket?.status || "Unknown"}
                </p>
                <TicketActions ticket={ticket} setRefetch={setRefetch}/>
              </div>
            </div>

            <hr className="my-4 border-[var(--color-text-light)] opacity-20" />

            {/* Description Section */}
            <div>
              <p className="mt-3 text-base">
                <span className="font-semibold text-[var(--color-text-light)]">
                  Description:
                </span>{" "}
                {ticket?.description || "No description provided."}
              </p>
            </div>

            {/* Screenshot Section */}
            {ticket?.screenshot && (
              <div className="mt-4 flex items-center justify-center flex-col">
                <Divider title="Screenshot" />
                <img
                  src={ticket?.screenshot?.replace('/uploads/', '/uploads/w_full/')} 
                  loading="lazy"
                  alt="Ticket Screenshot"
                  className="mt-2 rounded-lg shadow-md max-w-full h-auto"
                />
              </div>
            )}

            {/* Tags Section */}
            {ticket?.tags && ticket.tags.length > 0 && (
              <div className="mt-4">
                <Divider title="Tags" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {ticket.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Response Section */}
            {ticket?.response && (
              <div className="mt-4">
                <Divider title="Response" />
                <p className="mt-2">{ticket?.response}</p>
              </div>
            )}
          </div>

          {/* CreatedBy User Section */}
          {client && (
            <div className="mt-6">
              <Divider title="Raised By" />
              <ClientCard client={client} />
            </div>
          )}

          {/* Assigned User Section */}
          {ticket?.assignedTo && (
            <div className="mt-6">
              <Divider title="Assigned To" />
              <UserCard user={ticket?.assignedTo} />
            </div>
          )}
        </>
      )}

      {loading && (
        <div className="flex-1 flex items-center justify-center h-full w-full ">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
