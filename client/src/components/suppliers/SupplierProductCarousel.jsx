import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Carousel from "../utils/Carousel";
import ProductCardSmall from "../products/ProductCardSmall";

const SupplierProductCarousel = () => {
  const { id } = useParams();
  const [results, setResults] = React.useState({
    products: [],
  });
  const [refetch, setRefetch] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/suppliers/${id}/products?page=${page}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("An error occurred while fetching the products");
        }
        const data = await response.json();
        setResults({
          ...data,
          products: [...results?.products, ...data?.products],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id, refetch, page]);

  return (
    <div className="flex overflow-x-auto snap-x gap-4 pb-4 hide-scrollbar w-full">
      <Carousel
        items={results?.products}
        renderItem={(product, index) => (
          <ProductCardSmall
            key={index}
            product={product}
            setRefetch={setRefetch}
          />
        )}
        loadMore={() => setPage((p) => p + 1)}
        hasMore={results?.hasMore}
        loading={loading}
      />
    </div>
  );
};

export default SupplierProductCarousel;
