import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../utils";
import SortableLink from "../utils/SortableLink";

const SupplierPurchaseTable = () => {
  const { id } = useParams();
  const [results, setResults] = useState({});
  const [sort, setSort] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupplierPurchases = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/suppliers/${id}/purchases?sort=${sort}&sortType=${sortType}&page=${page}`,
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
      }
    };
    fetchSupplierPurchases();
  }, [id, sort, sortType]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[var(--color-card)] border-b border-neutral-500/50">
          <tr>
            <th className="p-3 text-left max-w-[100px]">ID</th>
            <th className="p-3 pl-0 text-left min-w-[80px]">
              <SortableLink
                title="createdAt"
                setSort={setSort}
                sortType={sortType}
                setSortType={setSortType}
                isActive={sort == "createdAt"}
              />
            </th>
            <th className="p-3 pl-0 text-left">
              <SortableLink
                title="totalAmount"
                setSort={setSort}
                sortType={sortType}
                setSortType={setSortType}
                isActive={sort == "totalAmount"}
              />
            </th>
            <th className="p-3 text-left">Paid</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {results.purchases?.length &&
            results?.purchases?.map((purchase, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => navigate(`/purchases/${purchase._id}`)}
                  className="border-b border-neutral-500/20 hover:bg-[var(--color-card)] hover:bg-opacity-60 cursor-pointer"
                >
                  <td className="p-3 truncate text-ellipsis max-w-[100px]">
                    {purchase?._id}
                  </td>
                  <td className="p-3 min-w-[80px]">
                    {formatDate(purchase?.createdAt)}
                  </td>
                  <td className="p-3">₹{purchase?.totalAmount}</td>
                  <td className="p-3">₹{purchase?.paidAmount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        purchase?.deficitAmount < 0
                          ? "bg-orange-500/20 text-orange-500"
                          : "bg-green-500/20 text-green-500"
                      }`}
                    >
                      {purchase?.deficitAmount < 0 ? "Pending" : "Paid"}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierPurchaseTable;
