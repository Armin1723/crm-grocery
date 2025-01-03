import React, { useEffect } from "react";
import Divider from "../utils/Divider";
import InventoryCard from "./InventoryCard";

const InventoryTable = ({
  results = {},
  setPage = () => {},
  setRefetch = () => {},
  loading = false,
}) => {

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
                      className="flex gap-1 min-w-full w-full snap-start p-4"
                    >
                      <InventoryCard upid={product.upid} editable />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : loading ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="spinner"></div>
        </div>
      ) : (
        <p className="text-lg max-lg:text-base p-2">
          No products found in inventory.
        </p>
      )}
    </div>
  );
};

export default InventoryTable;
