import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PurchaseCardSmall from "../purchases/PurchaseCardSmall";

const ProductPurchases = () => {
  const [results, setResults] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchProductPurchases = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/products/${id}/purchases?page=${page}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        } else {
          setResults({
            ...data,
            purchases: [
              ...(results?.purchases || []),
              ...(data?.purchases || []),
            ],
          });
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductPurchases();
  }, [id, refetch, page]);

  return (
    <div className="flex w-full min-h-fit overflow-x-auto scroll-snap snap-x snap-mandatory">
      {!results?.purchases?.length && !loading && (
        <div className="flex flex-col min-w-full w-full md:w-1/2 md:min-w-[50%] lg:w-1/3 lg:min-w-[33%] rounded-md px-4 py-2 snap-start h-fit">
          <p className="text-lg max-sm:text-base text-[var(--color-text-light)]">
            No purchases found
          </p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col min-w-full w-full h-full items-center justify-center">
          <div className="spinner" />
        </div>
      )}

      {results?.purchases &&
        results?.purchases?.map((purchase, index) => (
          <div
            key={index}
            className="flex flex-col min-w-full w-full md:w-1/2 md:min-w-[50%] xl:w-1/3 xl:min-w-[33%] rounded-md p-2 snap-start h-fit"
          >
            <PurchaseCardSmall purchase={purchase} />
          </div>
        ))}
      {results.hasMore && (
        <div className="flex flex-col min-w-full w-full md:w-1/2 md:min-w-[50%] lg:w-1/3 lg:min-w-[33%] rounded-md px-4 py-2 snap-start h-full ">
          <div className="flex justify-center items-center h-full w-full bg-[var(--color-card)] p-4 mb-4 rounded-md border border-neutral-500/50">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="text-accent hover:text-accentDark"
            >
              {loading ? <div className="spinner"></div> : "Load More"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPurchases;
