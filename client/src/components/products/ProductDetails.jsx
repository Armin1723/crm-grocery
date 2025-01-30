import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import Divider from "../utils/Divider";
import ProductPurchases from "./ProductPurchases";
import ProductBarcode from "./ProductBarcode";
import InventoryCard from "../inventory/InventoryCard";
import ProductSales from "./ProductSales";

const ProductDetails = ({ idBackup = "" }) => {
  let { id } = useParams();
  if (!id) id = idBackup;
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
    <div className="p-3 rounded-md flex max-lg:min-h-[70vh] h-full flex-col gap-4 border border-neutral-500/50 bg-[var(--color-sidebar)] overflow-y-auto flex-1">
      <div className="wrapper flex flex-col overflow-y-auto ">
        <Divider title="Product Details" />
        <ProductCard product={product} setRefetch={setRefetch} />

        <Divider title="Barcode Details" />
        <ProductBarcode product={product} setRefetch={setRefetch} />

        <div className="flex flex-col gap-4">
          <Divider title="Recent Sales" />
          <ProductSales />
        </div>

        <div className="flex flex-col gap-4">
          <Divider title="Past Purchases" />
          <ProductPurchases />
        </div>

        <Divider title="Inventory Details" />
        <InventoryCard upid={product?.upid} />
      </div>
    </div>
  );
};

export default ProductDetails;
