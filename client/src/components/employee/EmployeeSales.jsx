import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pagination from "../utils/Pagination";
import SortableLink from "../utils/SortableLink";
import { formatDate } from "../utils";
import HoverCard from "../shared/HoverCard";
import SaleDetails from "../sales/SaleDetails";

const EmployeeSales = () => {
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");

  const { id: uuid } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchEmployeeSales = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/employees/${uuid}/sales?page=${page}&sort=${sort}&sortType=${sortType}`,
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
    fetchEmployeeSales();
  }, [uuid, page, sort, sortType]);

  return (
    <div className="overflow-y-auto max-h-[50vh] w-full">
    
    {(results?.sales?.length && !loading) ? (
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
            <th className="p-3 text-left">Products</th>
            <th className="p-3 text-left">
              <SortableLink
                title="SignedBy"
                setSort={() => setSort("signedBy")}
                sortType={sortType}
                setSortType={setSortType}
                isActive={sort == "signedBy"}
              />
            </th>
          </tr>
        </thead>

        <tbody>
          {results?.sales?.length && !loading &&
            results?.sales?.map((sale, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => navigate(`/sales/${sale?._id}`)}
                  className="border-b border-neutral-500/20 hover:bg-[var(--color-card)] hover:bg-opacity-60 cursor-pointer"
                >
                  <td className="p-3 truncate text-ellipsis max-w-[100px]">
                    {sale?._id}
                  </td>
                  <td className="p-3 min-w-[80px]">
                    {formatDate(sale?.createdAt)}
                  </td>
                  <td className="p-3">₹{sale?.totalAmount}</td>
                  <td className="p-3">{sale?.products?.length}</td>
                  <td className="p-3 truncate text-ellipsis max-w-[100px] capitalize">
                    {sale?.signedBy?.name}
                  </td>
                </tr>
              );
            })}

          {!results?.sales?.length && (
            <tr>
              <td colSpan="5" className="p-3 text-center">
                No Sales found
              </td>
            </tr>
          )}

          <tr className="bg-[var(--color-card)] sticky -bottom-1">
            <td
              className="p-3 text-sm text-[var(--color-text-light)]"
              colSpan={3}
            >
              <span>
                Showing {(results?.page - 1) * 10 + 1} -{" "}
                {results?.sales?.length + (results?.page - 1) * 10} of{" "}
                {results?.totalResults} purchases
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
  );
};

export default EmployeeSales;
