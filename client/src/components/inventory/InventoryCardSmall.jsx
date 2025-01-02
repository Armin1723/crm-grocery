import React from "react";
import Wave from "react-wavify";
import { getColor } from "../utils";
import InventoryActionButton from "./InventoryActionButton";

const InventoryCardSmall = ({ product }) => {
  const formatHeight = (unit) => {
    if (unit === "gm" || unit === 'ml') {
      return Math.min(Math.max(product?.quantity / 1000, 0), 100);
    } else {
      return Math.min(Math.max(product?.quantity, 0), 100);
    }
  };

  const height = formatHeight(product?.details?.secondaryUnit);

  return (
    <div className="inventory-card relative flex flex-col items-center justify-center w-full aspect-video rounded-md border border-neutral-500/50 shadow-[0_0_20px_gray] !shadow-neutral-500/20 bg-[var(--color-card)] pr-2">
      <div className="title w-full flex flex-col py-3 max-sm:py-2 px-4">
        <div className="line-1 flex w-full justify-between items-center">
          <p className="text-lg max-sm:text-base font-bold">
            {product?.productName}
          </p>
          <InventoryActionButton product={product} />
        </div>
        <p className="">
          Stock: {product?.totalQuantity} {product?.details?.unit}
        </p>
        <div className="flex gap-3 w-full ">
          
          <p>PR: {product?.purchaseRate}</p>
          <p>SR: {product?.sellingRate}</p>
        </div>
      </div>
      {/* Container image */}
      <div
          className="container-image relative flex-1 w-full aspect-square"
          style={{
            width: "100%",
            backgroundImage: "url('/inventory/clip-mask-2.webp')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        >
          {/* Wave animation masked to the container */}
          <Wave
            fill={getColor(formatHeight(product?.details?.secondaryUnit))}
            paused={false}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              maskImage: "url('/inventory/clip-mask-2.webp')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url('/inventory/clip-mask-2.webp')",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              mixBlendMode: "color-burn",
            }}
            options={{
              height: height,
              amplitude: 20,
              speed: 0.15,
              points: 6,
            }}
          />
        </div>

        
    </div>
  );
};

export default InventoryCardSmall;
