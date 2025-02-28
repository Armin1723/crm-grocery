import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SaleCardSmall from "../sales/SaleCardSmall";
import Carousel from "../utils/Carousel";

const ProductSales = () => {
  const [results, setResults] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchProductSales = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/products/${id}/sales?page=${page}`,
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
            sales: [...(results?.sales || []), ...(data?.sales || [])],
          });
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductSales();
  }, [id, refetch, page]);

  return (
    <div className="flex w-full overflow-x-auto overflow-y-visible scroll-snap snap-x snap-mandatory">
      <Carousel
        items={results?.sales}
        hasMore={results?.hasMore}
        loadMore={() => setPage((p) => p + 1)}
        loading={loading}
        renderItem={(sale) => <SaleCardSmall sale={sale} />}
      />

    </div>
  );
};

export default ProductSales;
