import React, { useEffect, useRef, useState } from "react";
import CategorySelection from "../products/CategorySelection";
import InventoryCard from "./InventoryCard";
import Divider from "../utils/Divider";
import TimePeriodSelection from "../utils/TimePeriodSelection";

const ExpiringInventory = () => {
  const [category, setCategory] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState("month");
  const [results, setResults] = useState({});
  const [page, setPage] = useState(1);

  const [isFetching, setIsFetching] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setIsFetching(true);
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/inventory/expiring?category=${category}&time=${timePeriod}&page=${page}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setResults({
          ...data,
          inventory:
            page === 1
              ? data?.inventory
              : [...(results?.inventory || []), ...data?.inventory],
        });
      } catch (error) {
        console.error("Error fetching expiring inventory:", error.message);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchInventory();
  }, [refetch, category, timePeriod, page]);

  //Use Effect to handle the infinite scroll
  useEffect(() => {
    let timer = null;
    const handleScroll = () => {
      if (
        containerRef.current.scrollTop + containerRef.current.clientHeight >=
        containerRef.current.scrollHeight
      ) {
        if (!isFetching && results.hasMore) {
          if (timer) return;
          timer = setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
            timer = null;
          }, 500);
        }
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isFetching, results.hasMore]);

  const { inventory } = results;

  return (
    <>
      <div className="title flex items-center justify-between w-full space-x-2 flex-wrap">
        <div className="title-left flex items-center gap-3 flex-wrap max-sm:gap-0">
          <div className="title-button flex items-center gap-2">
            <p className="md:my-2 text-xl max-lg:text-lg font-bold pl-2">
              Expiring Inventory
            </p>
            <div
              onClick={() => setRefetch((prev) => !prev)}
              className={`w-4 aspect-square border-l-2 border-r-2 rounded-full border-accent cursor-pointer ${
                loading && "animate-spin"
              }`}
            />
          </div>
          <CategorySelection category={category} setCategory={setCategory} />
          <TimePeriodSelection
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex flex-col flex-1 w-full overflow-y-auto"
      >
        {inventory && inventory.length ? (
          <>
            {inventory.map((categoryData) => {
              return (
                <div key={categoryData?._id} className="flex flex-col gap-1">
                  <p className="text-lg max-lg:text-base font-bold pl-2">
                    <Divider
                      title={`${categoryData?._id} (${
                        categoryData?.products?.length || 0
                      } item)`}
                    />
                  </p>
                  <div className="flex gap-1 horizontal-scrollbar scroll-snap snap-x snap-mandatory min-w-full overflow-x-auto pb-4">
                    {categoryData.products.map((product) => {
                      return (
                        <div
                          key={product._id}
                          className="flex gap-1 min-w-full w-full snap-start p-4"
                        >
                          <InventoryCard upid={product.upid} editable />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {results?.hasMore && (
              <div className="flex justify-center p-2">
                <div className="" onClick={() => setPage((page) => page + 1)}>
                  {loading ? <div className="spinner" /> : <>Load More</>}
                </div>
              </div>
            )}
          </>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="spinner"></div>
          </div>
        ) : (
          <p className="text-sm p-2 h-full w-full flex flex-col items-center justify-center text-[var(--color-text-light)]">
            No such products found in inventory.
          </p>
        )}
      </div>
    </>
  );
};

export default ExpiringInventory;
