import React from "react";
import SaleForm from "./SaleForm";

const AddSale = () => {
  return (
    <div className="p-3 h-full overflow-y-scroll overflow-x-hidden w-full  rounded-md flex flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="title flex items-center gap-2 my-2">
        <p className="text-xl max-lg:text-lg font-bold">Add Sale</p>
      </div>
      <SaleForm />
    </div>
  );
};

export default AddSale;
