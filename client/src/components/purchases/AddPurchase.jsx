import React, { useRef } from "react";
import PurchaseForm from "./PurchaseForm";
import FullScreenToggle from "../utils/FullScreenToggle";

const AddPurchase = () => {
  const pageRef = useRef(null);
  return (
    <div ref={pageRef} className="p-3 h-full overflow-y-scroll overflow-x-hidden w-full  rounded-md flex flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="title flex items-center gap-2 my-2">
        <p className="text-xl max-lg:text-lg font-bold ">Add Purchase</p>
        <FullScreenToggle pageRef={pageRef}/>
      </div>
      <PurchaseForm />
    </div>
  );
};

export default AddPurchase;
