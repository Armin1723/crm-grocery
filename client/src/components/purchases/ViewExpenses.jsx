import React, { useEffect, useState } from "react";
import SortableLink from "../utils/SortableLink";
import Pagination from "../utils/Pagination";
import { expenseCategoryColors, expenseTypes, formatDate } from "../utils";
import CategorySelection from "../utils/CategorySelection";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ViewExpenses = () => {

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [category, setCategory] = useState("");

  const steps = [10, 20, 50, 100];

  const queryClient = useQueryClient();
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
  };
  const { data: results, isFetching: loading } = useQuery({
    queryKey: ["expenses", { sort, category, sortType, limit, page }],
    queryFn: async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/expenses?sort=${sort}&category=${category}&sortType=${sortType}&limit=${limit}&page=${page}`,
        {
          credentials: "include",
        }
      );
      return await response.json();
    },
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="top flex w-full justify-between flex-wrap my-2">
        <div className="title flex items-center gap-2 flex-wrap ">
          <p className="text-xl max-lg:text-lg font-bold ">View Expenses</p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => refetch()}
          ></p>
        </div>
        <CategorySelection
          category={category}
          setCategory={setCategory}
          categories={expenseTypes}
        />
      </div>

      <div className="table-wrapper flex relative flex-1 my-2 overflow-y-auto">
        <div
          className={`table-container w-full min-w-fit bg-[var(--bg-card)] h-full flex flex-col flex-nowrap overflow-x-auto px-2 shadow-md rounded-md max-sm:text-xs text-wrap relative ${
            loading && "overflow-hidden"
          }`}
        >
          <div className="table-headers flex w-full justify-between py-3 px-4 border rounded-t-md border-neutral-500/50  max-sm:px-1 sticky top-0 bg-[var(--color-card)] z-[20] font-semibold gap-2">
            <div className="w-1/5 min-w-[50px] flex items-center gap-2 ">
              <SortableLink
                title="Category"
                isActive={sort === "category"}
                sortType={sortType}
                setSort={() => setSort("category")}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[80px] flex items-center  ">
              <SortableLink
                title="Amount"
                isActive={sort === "amount"}
                sortType={sortType}
                setSort={() => setSort("amount")}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[25%] min-w-[80px] flex items-center  ">
              <SortableLink
                title="Description"
                isActive={sort === "description"}
                sortType={sortType}
                setSort={() => setSort("description")}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="signedBy"
                isActive={sort === "signedBy"}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-1/5 min-w-[50px] flex items-center  ">
              <SortableLink
                title="Date"
                isActive={sort === "createdAt"}
                sortType={sortType}
                setSort={() => setSort("createdAt")}
                setSortType={setSortType}
              />
            </div>
          </div>

          <div className="flex-1 border-l border-r border-neutral-500/50 flex flex-col ">
            {results?.expenses?.length ? (
              results?.expenses?.map((expense, index) => {
                const category = expense?.category?.toLowerCase() || "default";
                const { bg, border, text } =
                  expenseCategoryColors[category] ||
                  expenseCategoryColors.default;
                return (
                  <div
                    key={index}
                    className="tr flex w-full justify-between items-center py-3 px-4 max-sm:px-1 gap-2 hover:bg-accent/10"
                  >
                    <div className="w-1/5 min-w-[50px] px-2 capitalize">
                      <span
                        className={`px-3 rounded-lg border truncate text-ellipsis ${bg} ${border} ${text}`}
                      >
                        {expense?.category || "N/A"}
                      </span>
                    </div>

                    <div className="w-[15%] min-w-[80px] px-2">
                      {expense?.amount || "N/A"}
                    </div>
                    <div
                      className={`w-[25%] min-w-[80px] px-2 text-ellipsis truncate`}
                    >
                      {expense?.description || "N/A"}
                    </div>
                    <div className="w-[15%] min-w-[50px] px-2 capitalize">
                      {expense?.signedBy?.name || "N/A"}
                    </div>
                    <div className="w-1/5 min-w-[50px] px-2 ">
                      {formatDate(expense?.createdAt) || "N/A"}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="tr flex w-full flex-1 items-start py-2 px-4 max-sm:px-1 gap-2">
                <p>No expenses found</p>
              </div>
            )}
          </div>

          <div className="table-footer border border-neutral-500/50 rounded-b-md select-none flex w-full justify-between items-center max-lg:items-start p-3 px-4 max-sm:px-1 sticky bottom-0 bg-[var(--color-card)] font-semibold gap-2">
            <div className="flex items-center justify-start">
              <span>
                Showing {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, results?.totalExpenses) || 1} of{" "}
                {results?.totalExpenses} results.
              </span>
              <div className="flex items-center gap-1 mx-2">
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
                  disabled={limit === steps[0]}
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
                  disabled={
                    limit === steps[steps.length - 1] ||
                    results?.totalExpenses < limit
                  }
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
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExpenses;
