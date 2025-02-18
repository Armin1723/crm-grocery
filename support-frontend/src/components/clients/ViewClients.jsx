import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../utils/Pagination";
import SortableLink from "../utils/SortableLink";
import { formatDate, formatDateIntl } from "../utils";
import Avatar from "../utils/Avatar";

const ViewClients = () => {
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
          }/api/v1/clients?page=${page}&sort=${sort}&sortType=${sortType}&status=${status}`,
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
          <h1 className="text-xl font-bold">View Clients</h1>
          <button
            className={`w-4 aspect-square rounded-full border-b-2 border-t-2 border-accent ${
              loading && "animate-spin"
            }`}
            onClick={() => setRefetch((prev) => !prev)}
          ></button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 w-full">
        {!loading ? (
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--color-card)] border-b border-neutral-500/50 sticky top-0">
              <tr className="">
                <th className="p-3 pl-0">Avatar</th>
                <th className="p-3">
                  <SortableLink
                    title="ID"
                    setSort={() => setSort("_id")}
                    sortType={sortType}
                    setSortType={setSortType}
                    isActive={sort === "_id"}
                  />
                </th>
                <th className="p-3 pl-0 text-left min-w-[80px]">
                  <SortableLink
                    title="Name"
                    setSort={() => setSort("name")}
                    sortType={sortType}
                    setSortType={setSortType}
                    isActive={sort == "name"}
                  />
                </th>
                <th className="p-3 pl-0 text-left">Phone</th>
                <th className="p-3 pl-0 text-left min-w-[80px]">
                  <SortableLink
                    title="Joined"
                    setSort={() => setSort("createdAt")}
                    sortType={sortType}
                    setSortType={setSortType}
                    isActive={sort == "createdAt"}
                  />
                </th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">End Date</th>
              </tr>
            </thead>

            <tbody>
              {results?.clients?.length > 0 &&
                results?.clients?.map((client, index) => {
                  return (
                    <tr
                      key={index}
                      onClick={() => navigate(`/clients/${client?._id}`)}
                      className="border-b border-neutral-500/20 hover:bg-[var(--color-card)] hover:bg-opacity-60 cursor-pointer"
                    >
                      <td className="p-3 text-center">
                        <Avatar
                          image={client?.avatar}
                          alt={client?.name}
                          width={32}
                          withBorder={false}
                        />
                      </td>
                      <td className="p-3">{client?._id}</td>
                      <td className="p-3 capitalize">{client?.name}</td>
                      <td className="p-3">{client?.phone}</td>
                      <td className="p-3 min-w-[80px]">
                        {formatDate(client?.createdAt)}
                      </td>
                      <td className="p-3">
                        <p
                          className={`text-xs  px-3 rounded-lg w-fit capitalize border ${
                            client?.company?.subscription === "premium"
                              ? "bg-green-500/10 border-green-500 text-green-500"
                              : client?.company?.subscription === "trial"
                              ? "bg-orange-500/10 border-orange-500 text-orange-500"
                              : "bg-red-500/10 border-red-500 text-red-500"
                          } `}
                        >
                          {client?.company?.subscription || "N/A"}
                        </p>
                      </td>
                      <td className="p-3">
                        <span
                          className={`${
                            new Date(client?.company?.subscriptionEndDate) < new Date() &&
                            "!text-red-600"
                          }`}
                        >
                          {formatDateIntl(
                            client?.company?.subscriptionEndDate
                          ) || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}

              {!results?.clients?.length && (
                <tr className="flex-1 flex min-h-[40vh] w-full p-3">
                  <td>No Clients Found.</td>
                </tr>
              )}

              <tr className="bg-[var(--color-card)] sticky -bottom-1">
                <td
                  className="p-3 text-sm text-[var(--color-text-light)]"
                  colSpan={5}
                >
                  <span>
                    Showing {(results?.page - 1) * 10 + 1} -{" "}
                    {results?.clients?.length + (results?.page - 1) * 10} of{" "}
                    {results?.totalResults} clients.
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

export default ViewClients;
