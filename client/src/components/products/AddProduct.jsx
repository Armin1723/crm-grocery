import React, { useEffect } from "react";
import ProductForm from "./ProductForm";

const AddProduct = () => {
  const [refetch, setRefetch] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [refetch]);

  return (
    <div className="p-3 h-full max-sm:min-h-[80vh] w-full rounded-md flex flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="title flex items-center gap-2 my-2">
        <p className="text-xl max-lg:text-lg font-bold ">Add Product</p>
        <div
          className={`rounded-full w-4 aspect-square border-t border-b border-[var(--color-accent)] cursor-pointer ${
            isLoading && "animate-spin"
          }`}
          onClick={() => setRefetch((p) => !p)}
        ></div>
      </div>
      <div className="form-wrapper w-full px-1 py-4 flex-1 overflow-y-auto">
        <ProductForm />
      </div>
    </div>
  );
};

export default AddProduct;
