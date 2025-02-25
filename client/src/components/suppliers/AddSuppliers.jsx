import React from "react";
import SupplierForm from "./SupplierForm";

const AddSuppliers = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [refetch, setRefetch] = React.useState(false);

  return (
    <div className="p-3 flex-1 h-full w-full rounded-md flex flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="title flex items-center gap-2 my-2">
        <p className="text-xl max-lg:text-lg font-bold ">Add Supplier</p>
        <div
          className={`rounded-full w-4 aspect-square border-t border-b border-[var(--color-accent)] cursor-pointer ${
            isLoading && "animate-spin"
          }`}
          onClick={() => setRefetch((p) => !p)}
        ></div>
      </div>
      <div className="form-wrapper w-full px-1 py-4 flex-1 overflow-y-auto">
        <SupplierForm />
      </div>
    </div>
  );
};

export default AddSuppliers;
