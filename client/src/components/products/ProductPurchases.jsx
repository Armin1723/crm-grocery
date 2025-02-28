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
