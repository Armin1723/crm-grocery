import React from "react";
import InventoryTable from "../inventory/InventoryTable";

const Inventory = () => {

  return (
    <div className="flex flex-col m-2 rounded-md bg-[var(--color-sidebar)] select-none p-2 border border-neutral-500/50 flex-1 w-full overflow-y-auto">
      <div className="title flex items-center w-full gap-2">
        <p className="my-2 text-xl max-lg:text-lg font-bold pl-2">
          Inventory details
        </p>
      </div>
      <InventoryTable />
    </div>
  );
};

export default Inventory;
