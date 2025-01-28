import React, { useEffect, useState } from "react";
import Avatar from "../utils/Avatar";
import {
  formatDateIntl,
  formatExpiryColor,
  formatHeight,
  getColor,
  isMergable,
} from "../utils";
import Divider from "../utils/Divider";
import { Link } from "react-router-dom";
import Wave from "react-wavify";
import InventoryActions from "./InventoryActions";
import { FaObjectGroup } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const InventoryCard = ({ upid = "", inventoryData = {}, editable = false }) => {
  const [inventory, setInventory] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user);
  const isAdmin = user && user?.role === "admin";

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/${upid}`,
          {
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

  const handleHardMerge = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/inventory/${upid}/batches/merge/hard`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to merge batches");
      }
      setRefetch((prev) => !prev);
      toast.success("Batches merged successfully");
    } catch (error) {
      toast.error(error.message || "Failed to merge batches");
      console.error(error.message);
    }
  };

  if (!inventory && !loading)
    return (
      <div className="flex flex-col min-w-full w-full md:w-1/2 md:min-w-[50%] lg:w-1/3 lg:min-w-[33%] rounded-md px-4 py-2 snap-start h-fit">
        <p className="text-sm text-[var(--color-text-light)]">
          Not in inventory.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 w-full bg-[var(--color-card)] p-4 rounded-md max-sm:text-sm">
      <div className="product-details bg-[var(--color-primary)] flex w-full justify-between items-center gap-4 p-4 rounded-md">
        <Avatar
          image={inventory?.image?.replace("/upload", "/upload/w_80")}
          fallbackImage="/utils/product-placeholder.png"
          isThumbnail
          withBorder={false}
          width={80}
        />
        <div className="details flex flex-col flex-1 ">
          <div className="w-full flex items-center justify-between">
            <Link
              to={`/products/${inventory?.upid}`}
              className="text-base md:text-lg font-bold hover:underline"
            >
              {inventory?.name}
            </Link>
            {isMergable(inventory) && (
              <FaObjectGroup
                title="Hard Merge Batches"
                onClick={handleHardMerge}
                className="text-accent hover:text-accentDark cursor-pointer"
              />
            )}
          </div>
          <p className="flex items-center gap-2 text-[var(--color-text-light)] text-sm">
            Category: {inventory?.category} {`>`} {inventory?.subCategory}
          </p>
          <p className="text-[var(--color-text-light)] text-sm">
            Total Stock: {inventory?.totalQuantity} {inventory?.secondaryUnit}
          </p>
        </div>
      </div>

      <Divider title={`Batches: ${inventory?.batches?.length || 0}`} />

      <div className="batches flex max-w-full overflow-x-auto gap-3 snap-x snap-mandatory">
        {inventory?.batches?.length ? (
          inventory?.batches?.map((batch, index) => {
            return (
              <div
                key={index}
                className="batch flex flex-col gap-3 snap-start min-h-fit w-full min-w-full tab:w-1/2 tab:min-w-[50%] lg:w-1/3 lg:min-w-fit"
              >
                <div className="batchCard bg-[var(--color-primary)] max-sm:py-2 rounded-md flex items-center h-full w-full justify-center relative">
                  {/* Batch details */}
                  <div
                    className={`batch-left flex flex-col text-sm max-sm:text-xs p-2 text-ellipsis truncate }`}
                  >
                    <div className="text-xs md:text-sm font-bold flex items-center justify-between gap-1">
                      <p>Batch: {index + 1}</p>
                      {isAdmin && editable && (
                        <InventoryActions
                          batch={batch}
                          inventory={inventory}
                          upid={inventory?.upid}
                          setRefetch={setRefetch}
                        />
                      )}
                    </div>
                    <p className="text-[var(--color-text-light)]">
                      Quantity: {batch?.quantity} {inventory?.secondaryUnit}
                    </p>
                    <p className="text-[var(--color-text-light)]">
                      Expiry:{" "}
                      <span style={{ color: formatExpiryColor(batch?.expiry) }}>
                        {formatDateIntl(batch?.expiry) || "Not Set"}
                      </span>
                    </p>
                    <p className="text-[var(--color-text-light)]">
                      MRP: ₹{batch?.mrp}
                    </p>
                    <p className="text-[var(--color-text-light)]">
                      Purchase Rate:{" "}
                      {batch.purchaseRate
                        ? `₹${batch?.purchaseRate}`
                        : "Returned"}
                    </p>
                    <p className="text-[var(--color-text-light)]">
                      Selling Rate: ₹{batch?.sellingRate}
                    </p>
                  </div>

                  {/* Container image */}
                  {editable && (
                    <div
                      className="container-image relative max-w-[70%] tab:max-w-[50%] flex-1 min-h-full tab:h-[50%] aspect-square"
                      style={{
                        backgroundImage: "url('./inventory/clip-mask.png')",
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
                          maskImage: "url('./inventory/clip-mask.png')",
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskImage: "url('./inventory/clip-mask.png')",
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          mixBlendMode: "multiply",
                        }}
                        options={{
                          height:
                            130 -
                            formatHeight(
                              inventory.secondaryUnit,
                              batch.quantity
                            ),
                          amplitude: Math.random() * 10 + 15,
                          speed: Math.random() * 0.02 + 0.03,
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
            <p className="text-sm text-[var(--color-text-light)]">
              Not in inventory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryCard;
