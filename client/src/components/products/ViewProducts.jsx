import React, { useState } from "react";
import Pagination from "../utils/Pagination";
import SortableLink from "../utils/SortableLink";
import ProductActionButton from "./ProductActionButton";
import Avatar from "../utils/Avatar";
import SearchBar from "../utils/SearchBar";
import ProductCardSmall from "./ProductCardSmall";
import HoverCard from "../shared/HoverCard";
import { Link } from "react-router-dom";
import { categories } from "../utils";
import CategorySelection from "../utils/CategorySelection";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ViewProducts = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("name");
  const [sortType, setSortType] = useState("asc");
  const [category, setCategory] = useState(null);
  const [query, setQuery] = useState("");

  const steps = [10, 20, 50, 100];

  const queryClient = useQueryClient();
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };
  const {
    data: results,
    isFetching: loading,
  } = useQuery({
    queryKey: ["products", { sort, sortType, limit, page, category, query }],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/products?sort=${sort}&sortType=${sortType}&limit=${limit}&query=${query}&page=${page}${
            category ? `&category=${category}` : ""
          }`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="p-3 rounded-md flex h-full min-h-fit flex-1 flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="top flex w-full justify-between items-center flex-wrap my-2">
        <div className="title flex items-center gap-2 flex-wrap ">
          <p className="text-xl max-lg:text-lg font-bold ">View Products</p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => refetch()}
          ></p>
          <CategorySelection
            category={category}
            setCategory={setCategory}
            categories={categories}
          />
        </div>
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <div className="table-wrapper flex relative flex-1 my-2 overflow-x-auto">
        <div
          className={`table-container w-full min-w-[700px] bg-[var(--bg-card)] h-full flex flex-col flex-nowrap overflow-x-auto shadow-md rounded-md max-sm:text-xs text-wrap relative px-2 ${
            loading && "overflow-hidden"
          }`}
        >
          <div className="table-headers flex w-full justify-between py-3 px-4 border rounded-t-md border-neutral-500/50  max-sm:px-1 sticky top-0 bg-[var(--color-card)] z-[20] font-semibold gap-2">
            <p className="w-[10%] min-w-[100px] py-1">Image</p>
            <div className="w-1/5 min-w-[50px] flex items-center gap-2 ">
              <SortableLink
                title="name"
                isActive={sort === "name"}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[10%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="MRP"
                isActive={sort === "mrp"}
                sortType={sortType}
                setSort={() => setSort("mrp")}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="category"
                isActive={sort === "category"}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <div className="w-[15%] min-w-[50px] flex items-center  ">
              <SortableLink
                title="units"
                isActive={sort === "unit"}
                sortType={sortType}
                setSort={setSort}
                setSortType={setSortType}
              />
            </div>
            <p className="w-1/5 min-w-[100px] py-1">Tags</p>
            <p className="w-[10%] min-w-[50px] py-1">Actions</p>
          </div>

          <div className="table-row-goup flex-1 border-l border-r border-neutral-500/50 flex flex-col ">
            {results?.products?.length ? (
              results?.products?.map((product, index) => {
                return (
                  <div
                    key={index}
                    className={`tr flex w-full justify-between items-center py-2 px-4 max-sm:px-1 gap-2 hover:bg-accent/10 ${
                      index % 2 === 0 && "bg-[var(--color-primary)]"
                    }`}
                  >
                    <div className="w-[10%] min-w-[100px] py-1">
                      <Link to={`/products/${product.upid}`}>
                        <Avatar
                          image={product.image}
                          alt={product.name}
                          width={50}
                          withBorder={false}
                          fallbackImage="./utils/product-placeholder.png"
                        />
                      </Link>
                    </div>
                    <div className="w-1/5 min-w-[50px]">
                      <HoverCard title={product?.name} to={product?.upid}>
                        <ProductCardSmall product={product} editable={false} />
                      </HoverCard>
                    </div>
                    <div className="w-[10%] min-w-[50px] px-2">
                      {product?.mrp || "N/A"}
                    </div>
                    <div className="w-[15%] min-w-[50px] px-2 capitalize">
                      {product?.category || "N/A"}
                    </div>
                    <div className="w-[15%] min-w-[50px] px-2 capitalize flex-wrap">
                      {product?.primaryUnit === product?.secondaryUnit ? (
                        product?.primaryUnit
                      ) : (
                        <>
                          <p>{product?.primaryUnit || "N/A"},</p>
                          <p>{product?.secondaryUnit || "N/A"}</p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center flex-wrap gap-2 w-1/5 min-w-[50px]">
                      {product?.tags?.length
                        ? product?.tags?.map((tag, index) => {
                            return (
                              <span
                                key={index}
                                onClick={() => setQuery(tag)}
                                className="cursor-pointer px-2 py-0.5 border bg-accentDark/10 border-accentDark rounded-xl text-[var(--color-text-light)] gap-3 capitalize flex text-xs"
                              >
                                {tag}
                              </span>
                            );
                          })
                        : "N/A"}
                    </div>
                    <div className="actions w-[10%] min-w-[50px] flex items-center justify-center gap-2">
                      <ProductActionButton
                        product={product}
                        setRefetch={refetch}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="tr flex w-full flex-1 items-start py-2 px-4 max-sm:px-1 gap-2">
                <p>No products found</p>
              </div>
            )}
          </div>

          <div className="table-footer border border-neutral-500/50 rounded-b-md select-none flex w-full justify-between items-center max-lg:items-start p-3 px-4 max-sm:px-1 sticky bottom-0 bg-[var(--color-card)] font-semibold gap-2">
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
                  disabled={limit === steps[0]}
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
                  disabled={
                    limit === steps[steps.length - 1] ||
                    results?.totalProducts < limit
                  }
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
            <div className="spinner" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProducts;
