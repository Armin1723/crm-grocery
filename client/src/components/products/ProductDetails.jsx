import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import Divider from "../utils/Divider";
import ProductPurchases from "./ProductPurchases";
import ProductBarcode from "./ProductBarcode";
import InventoryCard from "../inventory/InventoryCard";
import ProductSales from "./ProductSales";
import SubscriptionOverlay from "../utils/SubscriptionOverlay";

const ProductDetails = ({ idBackup = "" }) => {
  let { id } = useParams();
  if (!id) id = idBackup;
  
  const [product, setProduct] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 403) {
            setError({ subscription: "Expired", message: data.message });
            throw new Error({
              subscription: "Expired",
              message: "Your subscription has expired. Please renew",
            });
          } else {
            setError(data);
            throw new Error({
              message: data.message || "Something went wrong.",
            });
          }
        }
        setProduct(data.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, refetch]);

  return (
    <div className="p-3 w-full rounded-md flex max-lg:min-h-[70vh] h-full flex-col gap-4 border border-neutral-500/50 bg-[var(--color-sidebar)] overflow-y-auto overflow-x-hidden flex-1">
      {loading ? (
        <div className="flex-1 flex flex-col w-full items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        error.subscription ? (
          <SubscriptionOverlay />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-red-500">
              {error.message || "Something went wrong."}
            </p>
          </div>
        )
      ) : (
        <div className="wrapper flex flex-col flex-1">
          <div className="flex flex-col gap-4 w-full">
            <Divider title="Product Details" />
            <ProductCard product={product} setRefetch={setRefetch} />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Divider title="Barcode Details" />
            <ProductBarcode product={product} setRefetch={setRefetch} />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Divider title="Recent Sales" />
            <ProductSales />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Divider title="Past Purchases" />
            <ProductPurchases />
          </div>

          <Divider title="Inventory Details" />
          <InventoryCard upid={product?.upid} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
