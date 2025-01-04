import React, { useEffect, useState } from "react";
import InventoryTable from "../inventory/InventoryTable";
import SearchBar from "../utils/SearchBar";

const Inventory = () => {
  const [results, setResults] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory?page=${page}&query=${query}`,
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
  }, [refetch, page, query]);

  return (
    <div className="flex flex-col m-2 rounded-md bg-[var(--color-sidebar)] select-none p-2 border border-neutral-500/50 flex-1 w-full overflow-y-auto">
      <div className="title flex items-center justify-between w-full space-x-2 flex-wrap">
        <div className="title-left flex items-center gap-2">
          <p className="md:my-2 text-xl max-lg:text-lg font-bold pl-2">
            Inventory Details
          </p>
          <div
            onClick={() => setRefetch((prev) => !prev)}
            className={`w-4 aspect-square border-l-2 border-r-2 rounded-full border-accent cursor-pointer ${
              loading && "animate-spin"
            }`}
          />
        </div>
        <SearchBar query={query} setQuery={setQuery} />
      </div>
      <InventoryTable results={results} loading={loading} setPage={setPage} />
    </div>
  );
};

export default Inventory;
