import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../utils";
import SortableLink from "../utils/SortableLink";
import Pagination from "../utils/Pagination";
import { useSelector } from "react-redux";

const CustomerSales = () => {
  const { id } = useParams();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const baseUrl = user?.role === "admin" ? "" : "/seller";

  useEffect(() => {
    const fetchCustomerSales = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/customers/${id}/sales?sort=${sort}&sortType=${sortType}&page=${page}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setResults(data);
      } catch (error) {
        console.error("Error fetching supplier purchases:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerSales();
  }, [id, sort, sortType, page]);

  return (
    <div className="overflow-y-auto min-h-fit flex-1 w-full">
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
              <SortableLink
                title="Total"
                setSort={() => setSort("totalAmount")}
                sortType={sortType}
                setSortType={setSortType}
                isActive={sort == "totalAmount"}
              />
            </th>
            <th className="p-3 text-left">Paid</th>
            <th className="p-3 text-left">Deficit</th>
            <th className="p-3 text-left">
              <SortableLink
                title="Status"
                setSort={() => setSort("deficitAmount")}
                sortType={sortType}
                setSortType={setSortType}
                isActive={sort == "deficitAmount"}
              />
            </th>
          </tr>
        </thead>

        <tbody>
          {results.sales?.length && 
            results?.sales?.map((sale, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => navigate(`${baseUrl}/sales/${sale._id}`)}
                  className="border-b border-neutral-500/20 hover:bg-[var(--color-card)] hover:bg-opacity-60 cursor-pointer"
                >
                  <td className="p-3 truncate text-ellipsis max-w-[100px]">
                    {sale?._id}
                  </td>
                  <td className="p-3 min-w-[80px]">
                    {formatDate(sale?.createdAt)}
                  </td>
                  <td className="p-3">₹{sale?.totalAmount}</td>
                  <td className="p-3">
                    ₹{sale?.paidAmount || sale?.totalAmount}
                  </td>
                  <td className="p-3">₹{sale?.deficitAmount || 0}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        sale?.deficitAmount > 0
                          ? "bg-orange-500/20 text-orange-500"
                          : "bg-green-500/20 text-green-500"
                      }`}
                    >
                      {sale?.deficitAmount > 0 ? "Pending" : "Paid"}
                    </span>
                  </td>
                </tr>
              );
            })}

          {!results.sales?.length && !loading && (
            <tr>
              <td colSpan="6" className="p-3 text-center">
                No sales found
              </td>
            </tr>
          )}
          {loading && (
            <tr>
              <td
                colSpan="6"
                className="p-3 min-h-[30vh] text-center"
              >
                <div className="flex items-center justify-center w-full">
                  <div className="spinner" />
                </div>
              </td>
            </tr>
          )}
          <tr className="bg-[var(--color-card)] sticky -bottom-1">
            <td
              className="p-3 text-sm text-[var(--color-text-light)]"
              colSpan={4}
            >
              <span>
                Showing {(results.page - 1) * 10 + 1} -{" "}
                {results?.sales?.length + (results?.page - 1) * 10} of{" "}
                {results?.totalResults} sales.
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
    </div>
  );
};

export default CustomerSales;
