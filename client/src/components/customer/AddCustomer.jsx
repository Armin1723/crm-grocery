import React, { useEffect } from "react";
import CustomerForm from "./CustomerForm";

const AddCustomer = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [refetch, setRefetch] = React.useState(false);

  useEffect(() => {}, [refetch]);

  return (
    <div className="p-3 flex-1 h-full w-full rounded-md flex flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="title flex items-center gap-2 my-2">
        <p className="text-xl max-lg:text-lg font-bold ">Add Customer</p>
        <div
          className={`rounded-full w-4 aspect-square border-t border-b border-[var(--color-accent)] cursor-pointer ${
            isLoading && "animate-spin"
          }`}
          onClick={() => setRefetch((p) => !p)}
        ></div>
      </div>
      <div className="form-wrapper w-full px-1 flex-1 overflow-y-auto flex flex-col">
        <CustomerForm title="add" setRefetch={setRefetch} expanded={true}/>
      </div>
    </div>
  );
};

export default AddCustomer;
