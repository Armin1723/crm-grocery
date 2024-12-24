import React from "react";
import InventoryCard from "./InventoryCard";

const InventoryTable = ({ inventory }) => {
  return (
    <div className="flex flex-col flex-1 w-full">
      {inventory?.map((categoryData) => {
        return (
          <div key={categoryData._id} className="flex flex-col gap-1">
            <p className="text-lg max-lg:text-base font-bold pl-2">
              {categoryData.category}
            </p>
            <div className="flex gap-1 scroll-snap snap-x snap-mandatory min-w-full overflow-x-auto py-4">
              {categoryData.products.map((product) => {
                return (
                  <div key={product._id} className="flex gap-1 min-w-[25%] max-sm:min-w-full snap-start p-4">
                    <InventoryCard product={product} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryTable;
