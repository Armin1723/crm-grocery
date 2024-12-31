import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PurchaseCardSmall from "../purchases/PurchaseCardSmall";

const ProductPurchases = () => {
  const [results, setResults] = useState({});
  const [refetch, setRefetch] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchProductPurchases = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/${id}/purchases`
        );
        const data = await res.json();
        if (res.ok) {
          setResults(data);
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProductPurchases();
  }, [id, refetch]);

  return (
    <div className="flex w-full min-h-fit overflow-x-auto scroll-snap snap-x snap-mandatory">
      {results?.purchases?.map((purchase, index) => (
        <div
          key={purchase._id}
          className="flex flex-col min-w-full w-full tab:w-1/2 tab:min-w-[50%] md:w-1/3 md:min-w-[33%] rounded-md p-4 snap-start h-fit"
        >
          <PurchaseCardSmall purchase={purchase} />
        </div>
      ))}
    </div>
  );
};

export default ProductPurchases;
