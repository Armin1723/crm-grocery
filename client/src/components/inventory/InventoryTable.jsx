import React, { useEffect, useState } from "react";
import Divider from "../utils/Divider";
import InventoryCard from "./InventoryCard";

const InventoryTable = () => {
  const [results, setResults] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const buffer = window.innerWidth < 768 ? 50 : 150;

      // Check if scrolled to the bottom
      if (
        container.scrollHeight - container.scrollTop - 50 <=
        container.clientHeight + buffer
      ) {
        if (results?.hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [results?.hasMore, loading]);

  useEffect(() => {
    setLoading(true);
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory?page=${page}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setResults({
          hasMore: data?.hasMore,
          page: data?.page,
          data: (data.page === 1) ? data?.data : [...results?.data, ...data?.data] ,
        });
      } catch (error) {
        console.error("Error fetching inventory:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [refetch, page]);

  const inventory = results?.data;
  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col flex-1 w-full overflow-y-auto"
    >
      {inventory && inventory.length ? (
        inventory.map((categoryData) => {
          return (
            <div key={categoryData?._id} className="flex flex-col gap-1">
              <p className="text-lg max-lg:text-base font-bold pl-2">
                <Divider
                  title={`${categoryData?._id} (${
                    categoryData?.products?.length || 0
                  } item)`}
                />
              </p>
              <div className="flex gap-1 scroll-snap snap-x snap-mandatory min-w-full overflow-x-auto pb-4">
                {categoryData.products.map((product) => {
                  return (
                    <div
                      key={product._id}
                      className="flex gap-1 min-w-full w-full md:min-w-[50%] md:max-w-[50%] lg:min-w-[100%] lg:w-full snap-start p-4"
                    >
                      <InventoryCard
                        upid={product.upid}
                        editable
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-lg max-lg:text-base p-2">
          No products found in inventory.
        </p>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
