import React from "react";
import InventoryCard from "./InventoryCard";
import Divider from "../utils/Divider";

const InventoryTable = ({ inventory }) => {
  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto">
      {(inventory && inventory.length) ? inventory.map((categoryData) => {
        return (
          <div key={categoryData._id} className="flex flex-col gap-1">
            <p className="text-lg max-lg:text-base font-bold pl-2">
              <Divider title={categoryData.category} />
            </p>
            <div className="flex gap-1 scroll-snap snap-x snap-mandatory min-w-full overflow-x-auto pb-4">
              {categoryData.products.map((product) => {
                return (
                  <div key={product._id} className="flex gap-1 min-w-full w-full md:min-w-[50%] md:max-w-[50%] lg:min-w-[25%] lg:max-w-[25%] snap-start p-4">
                    <InventoryCard product={product} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      }) : (
        <p className="text-lg max-lg:text-base p-2">
          No products found in inventory.
        </p>
      )}
    </div>
  );
};

export default InventoryTable;
