import React, { useEffect, useState } from "react";
import InventoryTable from "../inventory/InventoryTable";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [refetch]);

  return (
    <div className="flex flex-col m-2 rounded-md bg-[var(--color-sidebar)] select-none p-2 border border-neutral-500/50 flex-1 w-full overflow-y-auto">
      <div className="title flex items-center w-full gap-2">
        <p className="my-2 text-xl max-lg:text-lg font-bold pl-2">
          Inventory details
        </p>
        <div
          className={`w-4 aspect-square rounded-full border-t border-b border-accent ${
            loading && "animate-spin"
          } cursor-pointer`}
          onClick={() => setRefetch((p) => !p)}
        />
      </div>
      <InventoryTable inventory={inventory} />
    </div>
  );
};

export default Inventory;
