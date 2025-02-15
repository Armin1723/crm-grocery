import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../utils/Pagination";
import SortableLink from "../utils/SortableLink";
import { formatDate } from "../utils";

const ViewTickets = () => {
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [status, setStatus] = useState("");
  const [refetch, setRefetch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/tickets?page=${page}&sort=${sort}&sortType=${sortType}&status=${status}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Something went wrong");
        } else {
          setResults(data);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [page, sort, sortType, status, refetch]);

  return (
    <div className="flex flex-col gap-4 rounded-lg p-3 border border-neutral-500/50 h-full bg-[var(--color-sidebar)]">
      <div className="flex items-center flex-wrap justify-between">
        <div className="flex  items-center gap-2">
          <h1 className="text-xl font-bold">View Tickets</h1>
          <button
            className={`w-4 aspect-square rounded-full border-b-2 border-t-2 border-accent ${
              loading && "animate-spin"
            }`}
            onClick={() => setRefetch((prev) => !prev)}
          ></button>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" className="text-[var(--color-text-light)]">
              Choose Status
            </option>
            <option value="new">New</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 w-full">
        {!loading ? (
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--color-card)] border-b border-neutral-500/50 sticky top-0">
              <tr className="">
                <th className="p-3 text-left max-w-[100px]">ID</th>
                <th className="p-3 pl-0 text-left min-w-[80px]">
                  <SortableLink
                    title="Date"
                    setSort={() => setSort("createdAt")}
                    sortType={sortType}
                    setSortType={setSortType}
                    isActive={sort == "createdAt"}
                  />
                </th>
                <th className="p-3 pl-0 text-left">
                  Title
                </th>
                <th className="p-3 pl-0 text-left">
                  Tags
                </th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Assigned To</th>
              </tr>
            </thead>

            <tbody>
              {results?.tickets?.length > 0 &&
                results?.tickets?.map((ticket, index) => {
                  return (
                    <tr
                      key={index}
                      onClick={() => navigate(`/tickets/${ticket?._id}`)}
                      className="border-b border-neutral-500/20 hover:bg-[var(--color-card)] hover:bg-opacity-60 cursor-pointer"
                    >
                      <td className="p-3 truncate text-ellipsis max-w-[100px]">
                        {ticket?._id}
                      </td>
                      <td className="p-3 min-w-[80px]">
                        {formatDate(ticket?.createdAt)}
                      </td>
                      <td className="p-3 truncate text-ellipsis max-w-[400px]">{ticket?.title || "N/A"}</td>
                      <td className="p-3 flex flex-wrap gap-2">{ticket?.tags?.map((tag, index) =>{
                        return (
                          <span key={index} className="flex text-xs px-2 rounded-lg w-fit capitalize border bg-accent/10 border-accent text-accent">
                            {tag}
                          </span>
                        )
                      })}</td>
                      <td className="p-3">
                        <p
                          className={`text-xs  px-3 rounded-lg w-fit capitalize border ${
                            ticket?.status === "new"
                              ? "bg-accent/10 border-accent text-accent"
                              : ticket?.status === "open"
                              ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                              : ticket?.status === "in progress"
                              ? "bg-blue-500/10 border-blue-500 text-blue-500"
                              : "bg-green-500/10 border-green-500 text-green-500"
                          } `}
                        >
                          {ticket?.status}
                        </p>
                      </td>
                      <td className="p-3 truncate text-ellipsis max-w-[100px] capitalize">
                        {ticket?.assignedTo?.name}
                      </td>
                    </tr>
                  );
                })}

              {!results?.tickets?.length && (
                <div
                  className="flex-1 flex min-h-[40vh] w-full p-3"
                >
                  No Tickets Found.
                </div>
              )}

              <tr className="bg-[var(--color-card)] sticky -bottom-1">
                <td
                  className="p-3 text-sm text-[var(--color-text-light)]"
                  colSpan={4}
                >
                  <span>
                    Showing {(results?.page - 1) * 10 + 1} -{" "}
                    {results?.tickets?.length + (results?.page - 1) * 10} of{" "}
                    {results?.totalResults} tickets.
                  </span>
                </td>
                <td
                  className="p-3 text-sm text-[var(--color-text-light)] "
                  colSpan={2}
                >
                  <Pagination
                    page={page}
                    setPage={setPage}
                    totalPages={results?.totalPages}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="tr flex flex-1 items-center justify-center py-2 px-4 max-sm:px-1 gap-2 w-full h-full min-h-[30vh]">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTickets;
