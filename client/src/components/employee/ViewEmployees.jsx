import React, { useEffect, useState } from "react";
import Pagination from "../utils/Pagination";
import SortableLink from "../utils/SortableLink";
import { formatDate } from "../utils";
import Avatar from "../utils/Avatar";
import HoverCard from "../shared/HoverCard";
import EmployeeCard from "./EmployeeCard";
import EmployeeActions from "./EmployeeActions";

const ViewEmployees = () => {
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("name");
  const [sortType, setSortType] = useState("asc");

  const steps = [10, 20, 50, 100];

  const [results, setResults] = useState();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/employees?sort=${sort}&sortType=${sortType}&limit=${limit}&page=${page}`,
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
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [refetch, limit, page, sort, sortType]);

  return (
    <div className="p-3 rounded-md flex h-full w-full flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="top flex w-full justify-between items-center flex-wrap my-2">
        <div className="title flex items-center gap-2 flex-wrap ">
          <p className="text-base font-bold ">View Employees</p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => setRefetch((p) => !p)}
          ></p>
        </div>
      </div>

      <div className="table-wrapper flex relative flex-1 my-2 overflow-x-scroll text-xs md:text-sm ">
        <div
          className={`table-container w-full min-w-[700px] bg-[var(--bg-card)] h-full flex flex-col flex-nowrap overflow-x-auto shadow-md rounded-md max-sm:text-xs text-wrap relative px-2 ${
            loading && "overflow-hidden"
          }`}
        >
          <div className="table-headers flex w-full justify-between py-3 px-4 border rounded-t-md border-neutral-500/50 sticky top-0 bg-[var(--color-card)] z-[20] font-semibold gap-2">
            <p className="w-[10%] min-w-[100px]">Image</p>
            <div className="w-1/5 min-w-[50px] flex items-center gap-2 ">
              <SortableLink
                title="name"
                isActive={sort === "name"}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[10%] min-w-[80px] flex items-center  ">
              <SortableLink
                title="Role"
                isActive={sort === "role"}
                sortType={sortType}
                setSort={() => setSort("role")}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="UUID"
                isActive={sort === "uuid"}
                sortType={sortType}
                setSort={() => setSort("uuid")}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="Phone"
                isActive={sort === "phone"}
                sortType={sortType}
                setSort={() => setSort("phone")}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="Joined On"
                isActive={sort === "createdAt"}
                sortType={sortType}
                setSort={() => setSort("createdAt")}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[10%] min-w-[50px] flex items-center  ">
              Actions
            </div>
          </div>

          <div className="table-row-goup flex-1 border-l border-r border-neutral-500/50 flex flex-col ">
            {results?.employees?.length ? (
              results?.employees?.map((employee, index) => {
                return (
                  <div
                    key={index}
                    className="tr flex w-full justify-between items-center py-2 px-4 gap-2 hover:bg-accent/10"
                  >
                    <div className="w-[10%] min-w-[100px]">
                      <Avatar
                        image={employee?.avatar.replace('/uploads/', '/uploads/w_100,h_100,c_thumb/')}
                        alt={employee.name}
                        width={42}
                        withBorder={false}
                      />
                    </div>
                    <div className="w-1/5 min-w-[50px]">
                      <HoverCard title={<p className="capitalize">{employee?.name}</p>}>
                        <EmployeeCard employee={employee} />
                      </HoverCard>
                    </div>
                    <div className="w-[10%] min-w-[80px] capitalize truncate text-ellipsis">
                    <p
                        className={`px-3 w-fit rounded-lg border text-xs ${
                          employee?.role === "admin"
                            ? "border-red-600 bg-red-600/10 text-red-600"
                            : "text-accentDark border-accentDark bg-accentDark/10"
                        }`}
                      >
                        {employee?.role}
                      </p>
                    </div>
                    <div className="w-[15%] min-w-[50px] capitalize truncate text-ellipsis">
                      {employee?.uuid}
                    </div>
                    <div className="w-[15%] min-w-[50px] capitalize flex-wrap truncate text-ellipsis">
                      {employee?.phone || "N/A"}
                    </div>
                    <div className="w-[15%] flex items-center flex-wrap gap-2 min-w-[50px]">
                      {formatDate(employee?.createdAt)}
                    </div>
                    <div className="w-[10%] flex items-center flex-wrap gap-2 min-w-[50px]">
                      <EmployeeActions employee={employee} setRefetch={setRefetch} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="tr flex w-full flex-1 items-start py-2 px-4 max-sm:px-1 gap-2">
                <p>No Employees found</p>
              </div>
            )}
          </div>

          <div className="table-footer border border-neutral-500/50 rounded-b-md select-none flex w-full justify-between items-center max-lg:items-start p-3 px-4 sticky bottom-0 bg-[var(--color-card)] font-semibold gap-2">
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
                    results?.totalResults < limit
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
            <div className="spinner" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEmployees;
