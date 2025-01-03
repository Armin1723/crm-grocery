import React, { useEffect, useState } from "react";
import Avatar from "../utils/Avatar";
import { formatDateIntl, formatHeight, getColor, isMergable } from "../utils";
import Divider from "../utils/Divider";
import { Link } from "react-router-dom";
import Wave from "react-wavify";
import InventoryActions from "./InventoryActions";
import { FaObjectGroup } from "react-icons/fa";
import { toast } from "react-toastify";

const InventoryCard = ({ upid = "", inventoryData = {}, editable = false }) => {
  const [inventory, setInventory] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/${upid}`,{
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setInventory(data?.product);
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [upid, refetch]);

  const handleMerge = async () => {
    try{
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/${upid}/batches/merge`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to merge batches");
      }
      setRefetch((prev) => !prev);
      toast.success("Batches merged successfully");
    }catch(error){
      console.error(error.message);
    }
  }

  if (!inventory && !loading)
    return (
      <div className="flex flex-col min-w-full w-full md:w-1/2 md:min-w-[50%] lg:w-1/3 lg:min-w-[33%] rounded-md px-4 py-2 snap-start h-fit">
        <p className="text-lg max-sm:text-base text-[var(--color-text-light)]">
          Not in inventory.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 w-full bg-[var(--color-card)] p-4 rounded-md max-sm:text-sm">
      <div className="product-details bg-[var(--color-primary)] flex w-full justify-between items-center gap-4 p-4 rounded-md">
        <Avatar
          image={inventory?.image}
          fallbackImage="/utils/product-placeholder.png"
          withBorder={false}
          width={80}
        />
        <div className="details flex flex-col flex-1 ">
          <div className="w-full flex items-center justify-between">
            <Link
              to={`/products/${inventory?.upid}`}
              className="text-lg font-bold hover:underline"
            >
              {inventory?.name}
            </Link>
            {isMergable(inventory) && (
              <FaObjectGroup title="Merge Batches" onClick={handleMerge} className="text-accent hover:text-accentDark cursor-pointer" />
            )}
          </div>
          <p className="flex items-center gap-2 text-[var(--color-text-light)]">
            Category: {inventory?.category} {`>`} {inventory?.subCategory}
          </p>
          <p className="text-[var(--color-text-light)]">
            Total Stock: {inventory?.totalQuantity} {inventory?.secondaryUnit}
          </p>
        </div>
      </div>

      <Divider title={`Batches: ${inventory?.batches?.length || 0}`} />

      <div className="batches flex max-w-full overflow-x-auto gap-4 snap-x snap-mandatory">
        {inventory?.batches?.length ? (
          inventory?.batches?.map((batch, index) => {
            return (
              <div
                key={index}
                className="batch px-4 flex flex-col gap-2 snap-start w-full min-w-full md:w-1/2 md:min-w-[50%] lg:min-w-[33%] lg:w-1/3 "
              >
                <div className="batchCard bg-[var(--color-primary)] rounded-md flex items-center h-full w-full justify-center relative">
                  {/* Batch details */}
                  <div className="batch-left flex flex-col text-sm max-sm:text-xs p-4">
                    <div className="text-lg max-sm:text-base font-bold flex items-center gap-2">
                      <p>Batch: {index + 1}</p>
                      <InventoryActions
                        batch={batch}
                        inventory={inventory}
                        upid={inventory?.upid}
                        setRefetch={setRefetch}
                      />
                    </div>
                    <p className="text-[var(--color-text-light)]">
                      Quantity: {batch?.quantity} {inventory?.secondaryUnit}
                    </p>
                    <p className="text-[var(--color-text-light)]">
                      Expiry: {formatDateIntl(batch?.expiry) || "Not Set"}
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

                  {/* Container image */}
                  {editable && (
                    <div
                      className="container-image relative max-w-[60%] flex-1 min-h-[50%] aspect-square"
                      style={{
                        backgroundImage: "url('/inventory/clip-mask-4.webp')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        zIndex: 1,
                      }}
                    >
                      {/* Wave animation masked to the container */}
                      <Wave
                        fill={getColor(
                          formatHeight(inventory.secondaryUnit, batch.quantity)
                        )}
                        paused={false}
                        style={{
                          height: "100%",
                          width: "100%",
                          zIndex: 2,
                          display: "flex",
                          maskImage: "url('/inventory/clip-mask-4.webp')",
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskImage: "url('/inventory/clip-mask-4.webp')",
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          mixBlendMode: "multiply",
                        }}
                        options={{
                          height: 130 - formatHeight(
                            inventory.secondaryUnit,
                            batch.quantity
                          ),
                          amplitude: 20,
                          speed: 0.05,
                          points: 4,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col min-w-full w-full md:w-1/2 md:min-w-[50%] lg:w-1/3 lg:min-w-[33%] rounded-md px-4 py-2 snap-start h-fit">
            <p className="text-lg max-sm:text-base text-[var(--color-text-light)]">
              Not in inventory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryCard;
