import React, { useEffect } from "react";
import CategorySelection from "../products/CategorySelection";
import SearchBar from "../utils/SearchBar";
import Divider from "../utils/Divider";
import Avatar from "../utils/Avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const InventoryList = () => {
  const [category, setCategory] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [refetch, setRefetch] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);

  const user = useSelector((state) => state.user);
  const isAdmin = user && user.role && user?.role === "admin";

  useEffect(() => {
    setLoading(true);
    const fetchInventoryList = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/inventory/list?query=${query}&category=${category}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setResults(data.inventory);
      } catch (error) {
        console.error("Error fetching inventory:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventoryList();
  }, [refetch, query, category]);

  return (
    <>
      <div className="title flex items-center justify-between w-full flex-wrap sticky top-0 bg-[var(--color-sidebar)] pb-2 z-10 ">
        <div className="title-left flex items-center md:gap-3 gap-1 flex-wrap">
          <div className="main-title flex items-center gap-2 flex-wrap">
            <p className="md:my-2 text-xl max-lg:text-lg font-bold pl-2">
              Inventory List
            </p>
            <div
              onClick={() => setRefetch((prev) => !prev)}
              className={`w-4 aspect-square border-l-2 border-r-2 rounded-full border-accent cursor-pointer ${
                loading && "animate-spin"
              }`}
            />
          </div>
          <CategorySelection category={category} setCategory={setCategory} />
        </div>
        <SearchBar query={query} setQuery={setQuery} />
      </div>
      <div className="flex flex-col flex-1 w-full overflow-y-auto px-2">
        {results.length > 0 && loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="spinner" />
          </div>
        ) : (
          results.map((category, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center w-full h-full"
              >
                <Divider
                  title={`${category?._id} (${category?.products?.length} items)`}
                />
                <div className="flex flex-col gap-2 w-full rounded-md p-3 bg-[var(--color-card)] overflow-x-auto px-2">
                  <table className="w-full text-sm">
                    <thead className="bg-[var(--color-primary)] text-neutral-600">
                      <tr>
                        <th className="py-2 text-left pl-4 w-[10%]">Image</th>
                        <th className="py-2 text-left pl-4 w-1/4 min-w-[150px]">
                          Product
                        </th>
                        <th className="py-2 text-left pl-4 w-1/6">UPID</th>
                        <th className="py-2 text-left pl-4">Stock</th>
                        <th className="py-2 text-left pl-4">Batches</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category?.products.map((product) => (
                        <tr
                          key={product._id}
                          className="border-b border-neutral-500"
                        >
                          <td className="py-2 pl-4 w-[10%]">
                            <Avatar
                              image={product?.image}
                              width={32}
                              withBorder={false}
                              fallbackImage="/utils/product-placeholder.png"
                            />
                          </td>
                          <td className="py-2 pl-4 w-1/4 min-w-[150px]">
                            <Link
                              to={`${
                                isAdmin ? `/products/${product?.upid}` : ""
                              }`}
                            >
                              {product?.name}
                            </Link>
                          </td>
                          <td className="py-2 pl-4 w-1/6 text-ellipsis truncate">
                            {product?.upid}
                          </td>
                          <td className="py-2 pl-4">
                            {product?.totalQuantity} {product?.secondaryUnit}
                          </td>
                          <td className="py-2 pl-4">{product?.noOfBatches}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}

        {loading && results.length === 0 && (
          <div className="flex items-center justify-center w-full h-full">
            <div className="spinner" />
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="w-full my-2 h-full">No such inventory found.</div>
        )}
      </div>
    </>
  );
};

export default InventoryList;
