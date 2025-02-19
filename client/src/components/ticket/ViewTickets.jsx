import React from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../utils";
import Pagination from "../utils/Pagination";
import { useSelector } from "react-redux";

const ViewTickets = () => {
  const [page, setPage] = React.useState(1);
  const user = useSelector((state) => state.user);

  const {
    data: results,
    isFetching: loading,
    error,
  } = useQuery({
    queryKey: ["tickets", { page }],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPPORT_BACKEND_URL}/api/v1/tickets?createdBy=${
          user?._id
        }&page=${page}`
      );
      if (!response.ok) {
        const data = await response.json();
        throw {
          message: data.message || "An error occurred",
          status: response.status,
        };
      }
      return await response.json();
    },
    retry: false,
  });
  return (
    <div className="space-y-6 flex-1 text-[var(--color-text)] overflow-y-auto px-3">
      {loading ? (
        <div className="w-full h-full min-h-[40vh] flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 min-h-[40vh] w-full h-full flex items-center justify-center">
          {error.message || "An error occurred"}
        </div>
      ) : results?.tickets.length == 0 ? (
        <div className="text-[var(--color-text-light)] w-full h-full min-h-[40vh] my-6 flex items-center justify-center">
          No recent tickets.
        </div>
      ) : (
        results?.tickets?.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-[var(--color-sidebar)] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{ticket.title}</h3>
                <p className="text-xs text-[var(--color-text-light)]">
                  ID: {ticket._id}
                </p>
                <span className="text-xs italic text-gray-500">
                  Submitted on {formatDate(ticket.createdAt)}
                </span>
                <p className="mt-1 text-sm text-[var(--color-text-light)]">
                  {ticket.description}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full capitalize border ${
                  ticket.status === "new"
                    ? "bg-blue-500/10 text-blue-500 border-blue-500"
                    : ticket.status === "open"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500"
                    : ticket.status === "in progress"
                    ? "bg-purple-500/10 text-purple-500 border-purple-500"
                    : "bg-green-500/10 text-green-500 border-green-500"
                }`}
              >
                {ticket.status}
              </span>
            </div>
            {ticket.response && (
              <div className="mt-4 bg-[var(--color-card)] p-4 rounded-lg">
                <h4 className="text-sm font-medium">Response</h4>
                <p className="mt-2 text-sm">{ticket.response}</p>
              </div>
            )}
          </div>
        ))
      )}
      {results?.totalPages > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={results?.totalPages}
        />
      )}
    </div>
  );
};

export default ViewTickets;
