import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ProductCardSmall from "../products/ProductCardSmall";

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
      {results.products?.length > 0 &&
        results?.products.map((product, index) => (
          <div
            key={product._id}
            className="min-w-full w-full tab:min-w-[50%] tab:w-1/2 md:min-w-[50%] md:w-1/2 lg:min-w-[33%] lg:w-1/3 xl:w-1/4 xl:min-w-[25%]  overflow-hidden snap-start snap-mandatory"
          >
            <ProductCardSmall product={product} setRefetch={setRefetch} />
          </div>
        ))}
      {results?.hasMore && (
        <div
          onClick={() => setPage((p) => p + 1)}
          className="min-w-full w-full tab:min-w-[50%] tab:w-1/2 md:min-w-[50%] md:w-1/2 lg:min-w-[25%] lg:w-1/4  overflow-hidden snap-start snap-mandatory flex flex-col items-center justify-center bg-[var(--color-card)] rounded-lg border border-neutral-500/50 cursor-pointer"
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="font-medium flex flex-col items-center gap-2 text-accent hover:text-accentDark cursor-pointer">
              <FaChevronRight className="w-8 h-8 " />
              <p>Load More</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerProducts;
