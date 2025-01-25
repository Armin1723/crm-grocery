import React from "react";
import SaleForm from "./SaleForm";
import FullScreenToggle from "../utils/FullScreenToggle";

const AddSale = () => {
  const salesPageRef = React.useRef(null);
  return (
    <div ref={salesPageRef} className="p-3 h-full w-full rounded-md flex flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="title flex items-center gap-2 my-2">
        <p className="text-xl max-lg:text-lg font-bold">Add Sale</p>
        <FullScreenToggle pageRef={salesPageRef}/>
      </div>
      <SaleForm />
    </div>
  );
};

export default AddSale;
