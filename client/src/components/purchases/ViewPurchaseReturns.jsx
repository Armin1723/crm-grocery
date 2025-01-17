import React, { useEffect, useState } from "react";
import { formatDate } from "../utils";
import Pagination from "../utils/Pagination";
import SortableLink from "../utils/SortableLink";
import { FaFileInvoice } from "react-icons/fa";
import Modal from "../utils/Modal";
import { Link } from "react-router-dom";
import HoverCard from "../shared/HoverCard";
import PurchaseDetails from "./PurchaseDetails";

const ViewPurchaseReturns = () => {
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const [selectedPurchaseId, setSelectedPurchaseId] = useState("");

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");

  const steps = [10, 20, 50, 100];
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchPurchaseReturns = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/purchases/return?sort=${sort}&sortType=${sortType}&page=${page}`,
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
    fetchPurchaseReturns();
  }, [refetch, page, sort, sortType]);

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="top flex w-full justify-between flex-wrap my-2">
        <div className="title flex items-center gap-2 flex-wrap ">
          <p className="text-xl max-lg:text-lg font-bold ">
            View Purchase Returns
          </p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => setRefetch((p) => !p)}
          ></p>
        </div>
      </div>

      <div className="table-wrapper flex relative flex-1 my-2 overflow-x-scroll">
        <div
          className={`table-container w-full min-w-fit bg-[var(--bg-card)] h-full flex flex-col flex-nowrap overflow-x-auto shadow-md rounded-md max-sm:text-xs text-wrap relative ${
            loading && "overflow-hidden"
          }`}
        >
          <div className="table-headers flex w-full justify-between py-3 px-4 border rounded-t-md border-neutral-500/50  max-sm:px-1 sticky top-0 bg-[var(--color-card)] z-[20] font-semibold gap-2">
            <div className="w-1/5 min-w-[50px] flex items-center gap-2 ">
              Supplier
            </div>
            <div className="w-[15%] min-w-[80px] flex items-center  ">
              <SortableLink
                title="Purchase"
                isActive={sort === "purchaseId"}
                sortType={sortType}
                setSort={() => setSort("purchaseId")}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[80px] flex items-center  ">
              <SortableLink
                title="Total Amount"
                isActive={sort === "totalAmount"}
                sortType={sortType}
                setSort={setSort}
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
            <p className="w-[10%] min-w-[50px] py-1">Actions</p>
          </div>
          <div className="table-row-goup flex-1 border-l border-r border-neutral-500/50 flex flex-col ">
            {results?.purchaseReturns?.length ? (
              results?.purchaseReturns?.map((purchaseReturn, index) => {
                return (
                  <div
                    key={index}
                    className="tr flex w-full justify-between items-center p-4 max-sm:px-1 gap-2 hover:bg-accent/10"
                  >
                    <div className="w-1/5 min-w-[50px]">
                      {purchaseReturn?.supplier?.name ||
                        purchaseReturn?.supplier?.phone ||
                        "No data"}
                    </div>
                    <div className="w-[15%] min-w-[80px] px-2 truncate text-ellipsis">
                      <HoverCard
                        title={
                          <Link to={`/purchases/${purchaseReturn?.purchaseId}`}>
                            {" "}
                            {`${purchaseReturn?.purchaseId.slice(0, 10)}...` ||
                              "N/A"}{" "}
                          </Link>
                        }
                      >
                        <PurchaseDetails
                          idBackup={purchaseReturn?.purchaseId}
                        />
                      </HoverCard>
                    </div>
                    <div className="w-[15%] min-w-[80px] px-2">
                      {purchaseReturn?.totalAmount || "N/A"}
                    </div>
                    <div className="w-[15%] min-w-[50px] px-2 capitalize">
                      {purchaseReturn?.signedBy?.name || "N/A"}
                    </div>
                    <div className="w-1/5 min-w-[50px] px-2 text-sm max-sm:text-xs">
                      {formatDate(purchaseReturn?.createdAt) || "N/A"}
                    </div>
                    <div className="actions w-[10%] min-w-[50px] flex items-center justify-center gap-2">
                      <FaFileInvoice
                        className="text-red-500 hover:text-red-600 cursor-pointer"
                        onClick={() =>
                          setSelectedPurchaseId(purchaseReturn?.purchaseId)
                        }
                      />
                      {selectedPurchaseId === purchaseReturn?.purchaseId && (
                        <Modal
                          title="Return Invoice"
                          isOpen={true}
                          onClose={() => setSelectedPurchaseId(null)}
                        >
                          <embed
                            src={purchaseReturn?.invoice}
                            type="application/pdf"
                            width="100%"
                            height="600px"
                          />
                        </Modal>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="tr flex w-full flex-1 items-start py-2 px-4 max-sm:px-1 gap-2">
                <p>No Purchase returns found</p>
              </div>
            )}
          </div>
          <div className="table-footer border border-neutral-500/50 rounded-b-md select-none flex w-full justify-between items-center max-lg:items-start p-3 px-4 max-sm:px-1 sticky bottom-0 bg-[var(--color-card)] font-semibold gap-2">
            <div className="flex items-center">
              <span>
                Showing {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, results?.totalPurchases) || 1} of{" "}
                {results?.totalSales} results.
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
                  disabled={
                    limit === steps[0] || results.totalPurchases < limit
                  }
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
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPurchaseReturns;
