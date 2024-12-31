import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import Divider from "../utils/Divider";
import ProductPurchases from "./ProductPurchases";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/${id}`
        );
        const data = await res.json();
        if (res.ok) {
          setProduct(data.product);
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProduct();
  }, [id, refetch]);

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-4 border border-neutral-500/50 bg-[var(--color-sidebar)] overflow-y-auto flex-1">
      <div className="wrapper flex flex-col overflow-y-auto min-h-fit">
        <Divider title="Product Details" />
        <ProductCard product={product} setRefetch={setRefetch} />

        <Divider title="Past Purchases" />
        <ProductPurchases />
      </div>
    </div>
  );
};

export default ProductDetails;
