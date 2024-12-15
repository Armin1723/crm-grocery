import React, { useEffect, useState } from "react";
import ExportButton from "../utils/ExportButton";
import Pagination from "../utils/Pagination";
import SortableLink from "../utils/SortableLink";
import ProductActionButton from "./ProductActionButton";

const ViewProducts = () => {
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("name");
  const [sortType, setSortType] = useState("asc");
  const [category, setCategory] = useState(null);

  const steps = [10, 20, 50, 100];

  const [results, setResults] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/products?sort=${sort}&sortType=${sortType}&limit=${limit}&page=${page}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setResults(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refetch, limit, page, sort, sortType, category]);

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="top flex w-full justify-between flex-wrap">
        <div className="title flex items-center gap-2">
          <p className="text-xl max-lg:text-lg font-bold my-2">View Products</p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => setRefetch((p) => !p)}
          ></p>
        </div>
        <ExportButton title="Products" />
      </div>

      <div className="table-wrapper flex relative max-h-[55vh] flex-1 my-2 overflow-x-scroll">
        <div
          className={`table-container w-full min-w-fit bg-[var(--bg-card)] h-full flex flex-col flex-nowrap overflow-x-auto shadow-md rounded-md max-sm:text-xs text-wrap relative ${
            loading && "overflow-hidden"
          }`}
        >
          <div className="table-headers flex w-full justify-between py-3 px-4 border-b-2 border-neutral-500/50  max-sm:px-1 sticky top-0 bg-[var(--color-card)] z-[20] font-semibold gap-2">
            <div className="w-1/5 min-w-[50px] flex items-center gap-2 ">
              <SortableLink
                title="name"
                sort={sort}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[10%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="rate"
                sort={sort}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[10%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="category"
                sort={sort}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[10%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="unit"
                sort={sort}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <p className="w-1/5 min-w-[100px] py-1">Tags</p>
            <p className="w-[10%] min-w-[50px] py-1">Actions</p>
          </div>
          {results?.products &&
            results?.products?.map((product, index) => {
              return (
                <div
                  key={index}
                  className="tr flex w-full justify-between items-center py-2 px-4 max-sm:px-1 my-1 gap-2 hover:bg-accent/10"
                >
                  <div className="w-1/5 min-w-[50px]">
                    {product?.name}
                  </div>
                  <div className="w-[10%] min-w-[50px] px-2">
                    {product?.rate || "N/A"}
                  </div>
                  <div className="w-[10%] min-w-[50px] px-2 capitalize">
                    {product?.category || "N/A"}
                  </div>
                  <div className="w-[10%] min-w-[50px] px-2">
                    {product?.unit || "N/A"}
                  </div>
                  <div className="flex items-center flex-wrap gap-2 w-1/5 min-w-[50px]">
                    {product?.tags?.length ? product?.tags?.map((tag, index) => {
                      return (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-accent/10 rounded-xl border border-neutral-500/50 gap-3 capitalize flex text-sm max-sm:text-xs"
                        >
                          {tag}
                        </span>
                      );
                    }) : "N/A"}
                  </div>
                  <div className="actions w-[10%] min-w-[50px] flex items-center justify-center gap-2">
                    <ProductActionButton id={product._id} />
                  </div>
                </div>
              );
            })}
          <div className="table-footer select-none flex w-full justify-between items-center max-lg:items-start p-3 border-t-2 border-neutral-500/50 px-4 max-sm:px-1 sticky bottom-0 bg-[var(--color-card)] font-semibold gap-2">
            <div className="flex items-center">
              <span>
                Showing {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, results?.totalProducts)} of{" "}
                {results?.totalProducts} results.
              </span>
              <div className="flex items-center gap-2 mx-2">
                <button
                  onClick={() => {
                    setPage(1);

                    setLimit((prev) => {
                      const currentIndex = steps.indexOf(prev);
                      if (currentIndex > 0) {
                        return steps[currentIndex - 1];
                      }
                      return prev;
                    });
                  }}
                  disabled={limit === steps[0] || results.totalProducts < limit}
                  className="px-3 flex items-center justify-center rounded-md bg-[var(--color-primary)] w-6 aspect-square border border-neutral-500/50 hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-neutral-500/20"
                >
                  -
                </button>
                <button
                  onClick={() => {
                    setPage(1);

                    setLimit((prev) => {
                      const currentIndex = steps.indexOf(prev);
                      if (currentIndex < steps.length) {
                        return steps[currentIndex + 1];
                      }
                      return prev;
                    });
                  }}
                  disabled={limit === steps[steps.length - 1]}
                  className="px-3 flex items-center justify-center rounded-md bg-[var(--color-primary)] w-6 aspect-square border border-neutral-500/50 hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-neutral-500/20"
                >
                  +
                </button>
              </div>
            </div>
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={Math.ceil(results?.totalPages)}
            />
          </div>
        </div>
        {loading && (
          <div className="absolute overlay inset-0 hide-scrollbar z-[99] overflow-hidden bg-[var(--color-card)] flex items-center justify-center transition-all duration-300">
            {/* <Loader /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProducts;
