import React, { useEffect, useState } from "react";
import Avatar from "../utils/Avatar";
import { formatDate } from "../utils";
import Divider from "../utils/Divider";
import { Link } from "react-router-dom";

const InventoryCard = ({ upid = "" }) => {
  const [inventory, setInventory] = useState({});
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/${upid}`
        );
        const data = await res.json();
        if (res.ok) {
          setInventory(data.product);
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchInventory();
  }, [upid, refetch]);
  return (
    <div className="flex flex-col gap-2 w-full bg-[var(--color-card)] p-4 rounded-md">
      <div className="product-details bg-[var(--color-primary)] flex w-full justify-between items-center gap-4 p-4 rounded-md">
        <Avatar image={inventory?.image} width={80} />
        <div className="details flex flex-col flex-1 ">
          <Link to={`/products/${inventory?.upid}`} className="text-lg font-bold hover:underline">{inventory?.name}</Link>
          <p className="flex items-center gap-2 text-[var(--color-text-light)]">
            Category: {inventory?.category} {`>`} {inventory?.subCategory}
          </p>
          <p className="text-[var(--color-text-light)]">
            Total Stock: {inventory?.totalQuantity}
          </p>
        </div>
      </div>

        <Divider title={`Batches: ${inventory?.batches?.length || 0}`} />

      <div className="batches flex max-w-full overflow-x-auto gap-4 snap-x snap-mandatory">
        {inventory?.batches?.map((batch, index) => {
          return (
            <div
              key={index}
              className="batch bg-[var(--color-primary)] p-4 rounded-md flex flex-col gap-2 snap-start w-full min-w-full md:w-1/2 md:min-w-[50%] lg:min-w-[33%] lg:w-1/3 "
            >
              <div className="batchCard">
                <p className="text-lg font-bold">Batch: {index + 1}</p>
                <p className="text-[var(--color-text-light)]">
                  Quantity: {batch?.quantity}
                </p>
                <p className="text-[var(--color-text-light)]">
                  Expiry: {formatDate(batch?.expiry) || "Not Set"}
                </p>
                <p className="text-[var(--color-text-light)]">
                  MRP: ₹{batch?.mrp}
                </p>
                <p className="text-[var(--color-text-light)]">
                  Purchase Rate: ₹{batch?.purchaseRate}
                </p>
                <p className="text-[var(--color-text-light)]">
                  Selling Rate: ₹{batch?.sellingRate}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryCard;
