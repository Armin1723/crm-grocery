import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Divider from "../utils/Divider";
import SupplierCard from "./SupplierCard";
import SupplierPurchaseTable from "./SupplierPurchaseTable";

const ProductCarousel = () => {
  const products = [
    { id: 1, name: "Rice", price: 50, stock: 100 },
    { id: 2, name: "Wheat", price: 40, stock: 150 },
    { id: 3, name: "Sugar", price: 45, stock: 80 },
    { id: 4, name: "More", price: 0, stock: 0 },
  ];

  return (
    <div className="relative">
      <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
        {products.map((product) => (
          <div
            key={product.id}
            className={`
            flex-none w-64 p-4 rounded-lg
            ${product.id === 4 ? "bg-accent/20" : "bg-[var(--color-card)]"}
            border border-neutral-500/50 hover:border-accent/50
            transition-all duration-200
          `}
          >
            {product.id === 4 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <FaChevronRight className="w-8 h-8 text-accent" />
                <p className="font-medium">View More</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <div className="text-sm space-y-1">
                  <p>Price: ₹{product.price}</p>
                  <p>Stock: {product.stock} units</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SupplierDetails = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState({});
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/suppliers/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setSupplier(data.supplier);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id, refetch]);

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-4 border border-neutral-500/50 bg-[var(--color-sidebar)] overflow-y-auto">
      <div className="top flex w-full justify-between flex-wrap my-2">
        <div className="top-left title flex items-center gap-2 flex-wrap">
          <p className="text-xl max-lg:text-lg font-bold">Supplier Details</p>
          <div
            className={` ${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => setRefetch((p) => !p)}
          />
        </div>
      </div>

      <div className="wrapper flex-1 space-y-6 overflow-y-auto px-2">
        {/* Supplier Card */}
        <SupplierCard supplier={supplier} />

        {/* Purchase History */}
        <div className="space-y-3">
          <Divider title="Purchase History" />
          <SupplierPurchaseTable />
        </div>

        {/* Products */}
        <div className="space-y-3">
          <Divider title="Products History" />
          <ProductCarousel />
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
