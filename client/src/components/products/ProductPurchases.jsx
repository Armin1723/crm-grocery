import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PurchaseCardSmall from "../purchases/PurchaseCardSmall";
import Carousel from "../utils/Carousel";

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

      <Carousel
        items={results?.purchases || []}
        renderItem={(purchase) => <PurchaseCardSmall purchase={purchase} />}
        loadMore={() => setPage((p) => p + 1)}
        hasMore={results?.hasMore}
        loading={loading}
      />
    </div>
  );
};

export default ProductPurchases;
