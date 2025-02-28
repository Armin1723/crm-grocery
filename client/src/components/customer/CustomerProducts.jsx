import React from "react";
import { useParams } from "react-router-dom";
import ProductCardSmall from "../products/ProductCardSmall";
import Carousel from "../utils/Carousel";

const CustomerProducts = () => {
  const { id } = useParams();
  const [results, setResults] = React.useState({
    products: [],
  });
  const [refetch, setRefetch] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const fetchCustomerProducts = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/customers/${id}/products?page=${page}`,
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
    fetchCustomerProducts();
  }, [id, refetch, page]);

  return (
    <div className="flex overflow-x-auto snap-x gap-4 pb-4 hide-scrollbar w-full">
      <Carousel
        items={results?.products}
        renderItem={(product, index) => (
          <ProductCardSmall product={product} setRefetch={setRefetch} />
        )}
        hasMore={results?.hasMore}
        loading={loading}
        loadMore={() => setPage((p) => p + 1)}
      />
    </div>
  );
};

export default CustomerProducts;
