import React, { useEffect, useState } from "react";
import Pagination from "../utils/Pagination";
import SortableLink from "../utils/SortableLink";
import { Link } from "react-router-dom";
import SupplierActionButton from "./SupplierActionButton";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ViewSuppliers = () => {

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("name");
  const [sortType, setSortType] = useState("asc");
  const [query, setQuery] = useState("");

  const steps = [10, 20, 50, 100];

  const queryClient = useQueryClient();
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["suppliers"] });
  };
  const { data: results, isFetching: loading } = useQuery({
    queryKey: ["suppliers", { sort, sortType, limit, page, query }],
    queryFn: async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/suppliers?sort=${sort}&sortType=${sortType}&limit=${limit}&query=${query}&page=${page}`,
        {
          credentials: "include",
        }
      );
      return await response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="top flex w-full justify-between items-center flex-wrap my-2">
        <div className="title flex items-center gap-2 flex-wrap ">
          <p className="text-xl max-lg:text-lg font-bold ">View Suppliers</p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => refetch()}
          ></p>
        </div>
      </div>

      <div className="table-wrapper flex relative flex-1 my-2 overflow-x-scroll ">
        <div
          className={`table-container w-full min-w-fit bg-[var(--bg-card)] h-full flex flex-col flex-nowrap overflow-x-auto shadow-md rounded-md max-sm:text-xs text-wrap relative px-2 ${
            loading && "overflow-hidden"
          }`}
        >
          <div className="table-headers flex w-full justify-between py-3 px-4 border rounded-t-md border-neutral-500/50  max-sm:px-1 sticky top-0 bg-[var(--color-card)] z-[20] font-semibold gap-2">
            <div className="w-1/5 min-w-[50px] flex items-center gap-2 ">
              <SortableLink
                title="name"
                isActive={sort === "name"}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[10%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="balance"
                isActive={sort === "balance"}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="phone"
                isActive={sort === "phone"}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[80px] flex items-center  ">
              <SortableLink
                title="email"
                isActive={sort === "email"}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[10%] min-w-[50px] py-1">Actions</div>
          </div>

          <div className="table-row-goup flex-1 border-l border-r border-neutral-500/50 flex flex-col ">
            {results?.suppliers?.length ? (
              results?.suppliers?.map((supplier, index) => {
                return (
                  <div
                    key={index}
                    className="tr flex w-full justify-between items-center py-2 px-4 max-sm:px-1 gap-2 hover:bg-accent/10"
                  >
                    <Link
                      to={`${supplier?._id}`}
                      className="w-1/5 min-w-[50px] pl-2"
                    >
                      {supplier?.name}
                    </Link>
                    <div
                      className={`w-[10%] min-w-[50px] px-2 font-semibold flex items-center gap-2 ${
                        supplier.balance > 0
                          ? "text-red-500"
                          : supplier.balance < 0
                          ? "text-green-500"
                          : "text-blue-900"
                      }`}
                    >
                      {supplier.balance > 0 && <FaArrowDown />}
                      {supplier.balance < 0 && <FaArrowUp />}
                      <p>{supplier.balance}</p>
                    </div>
                    <div className="w-[15%] min-w-[50px] px-2 capitalize">
                      {supplier?.phone || "N/A"}
                    </div>
                    <div className="w-[15%] min-w-[80px] px-2 text-ellipsis truncate">
                      {supplier?.email || "N/A"}
                    </div>
                    <div className="actions w-[10%] min-w-[50px] flex items-center justify-center gap-2">
                      <SupplierActionButton
                        supplier={supplier}
                        setRefetch={refetch}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="tr flex flex-col w-full flex-1 items-start py-2 px-4 max-sm:px-1 gap-2">
                <p>No suppliers added.</p>
                <Link
                  to="add"
                  className="rounded-md px-3 py-1 bg-accent hover:bg-accentDark transition-all duration-300 ease-in text-white"
                >
                  Add Supplier?
                </Link>
              </div>
            )}
          </div>

          <div className="table-footer border border-neutral-500/50 rounded-b-md select-none flex w-full justify-between items-center max-lg:items-start p-3 px-4 max-sm:px-1 sticky bottom-0 bg-[var(--color-card)] font-semibold gap-2">
            <div className="flex items-center">
              <span>
                Showing {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, results?.totalResults)} of{" "}
                {results?.totalResults} results.
              </span>
              <div className="flex items-center gap-2 mx-2">
                <button
                  onClick={() => {
                    setPage(1);

                    setLimit((prev) => {
                      const currentIndex = steps.indexOf(prev);
                      if (currentIndex > 0) {
                        return steps[currentIndex - 1];
                      }
                      return prev;
                    });
                  }}
                  disabled={limit === steps[0] || results.totalProducts < limit}
                  className="px-3 flex items-center justify-center rounded-md bg-[var(--color-primary)] w-6 aspect-square border border-neutral-500/50 hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-neutral-500/20"
                >
                  -
                </button>
                <button
                  onClick={() => {
                    setPage(1);

                    setLimit((prev) => {
                      const currentIndex = steps.indexOf(prev);
                      if (currentIndex < steps.length) {
                        return steps[currentIndex + 1];
                      }
                      return prev;
                    });
                  }}
                  disabled={limit === steps[steps.length - 1]}
                  className="px-3 flex items-center justify-center rounded-md bg-[var(--color-primary)] w-6 aspect-square border border-neutral-500/50 hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-neutral-500/20"
                >
                  +
                </button>
              </div>
            </div>
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={Math.ceil(results?.totalPages)}
            />
          </div>
        </div>
        {loading && (
          <div className="absolute overlay inset-0 hide-scrollbar z-[99] overflow-hidden bg-[var(--color-card)] flex items-center justify-center transition-all duration-300">
            <div className="spinner" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSuppliers;
