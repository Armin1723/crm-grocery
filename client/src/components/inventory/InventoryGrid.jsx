import React, { useEffect, useState } from "react";
import SearchBar from "../utils/SearchBar";
import InventoryCard from "./InventoryCard";
import Divider from "../utils/Divider";
import CategorySelection from "../products/CategorySelection";

const InventoryGrid = () => {
  const [results, setResults] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const scrollContainerRef = React.useRef(null);

  // Fetch inventory data
  useEffect(() => {
    setLoading(true);
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/inventory?page=${page}&query=${query}&category=${category}`,
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
          data:
            data.page === 1 ? data?.data : [...results?.data, ...data?.data],
        });
      } catch (error) {
        console.error("Error fetching inventory:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [refetch, page, query, category]);

  // Infinite scroll
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

  const inventory = results.data;

  return (
    <>
      <div className="title flex items-center justify-between w-full flex-wrap sticky top-0 bg-[var(--color-sidebar)] pb-2 z-10">
        <div className="title-left flex flex-wrap items-center md:gap-3 gap-1">
          <p className="md:my-2 text-xl max-lg:text-lg font-bold pl-2">
            Inventory Grid
          </p>
          <div
            onClick={() => setRefetch((prev) => !prev)}
            className={`w-4 aspect-square border-l-2 border-r-2 rounded-full border-accent cursor-pointer ${
              loading && "animate-spin"
            }`}
          />
          <CategorySelection category={category} setCategory={setCategory} />
        </div>
        <SearchBar query={query} setQuery={setQuery} />
      </div>
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
          })
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

export default InventoryGrid;
