import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Divider from "../utils/Divider";
import Avatar from "../utils/Avatar";
import SaleDetailActions from "./SaleDetailActions";
import SaleCard from "./SaleCard";
import EmployeeCard from "../employee/EmployeeCard";

const SaleDetails = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSale(data.sale);
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchase();
  }, [id, refetch]);

  if (loading)
    return (
      <div className="p-3 rounded-md flex h-full flex-col items-center justify-center gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)] ">
        <div className="spinner "></div>
      </div>
    );

  return (
    <div className="p-3 rounded-md flex h-full flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)] overflow-y-auto">
      <div className="top flex w-full justify-between flex-wrap my-2">
        <div className="top-left title flex items-center gap-2 flex-wrap ">
          <p className="text-xl max-lg:text-lg font-bold ">Sale Details </p>
          <p
            className={`${
              loading && "animate-spin"
            } w-4 aspect-square rounded-full border-t border-b border-accent/90 cursor-pointer`}
            onClick={() => setRefetch((p) => !p)}
          ></p>
        </div>
        <SaleDetailActions sale={sale} />
      </div>

      <div className="wrapper flex-1 max-h-[58vh] overflow-y-auto px-2">
        {/* Sale Information */}
        <Divider title="Sale Information" />
        <SaleCard sale={sale} />
        

        {/* Purchase Products */}
        <Divider title="Sale Products" />
        <div className="saleProducts flex flex-col gap-2 w-full rounded-md p-3 bg-[var(--color-card)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-primary)] text-neutral-600">
              <tr>
                <th className="py-2 text-left pl-4">Image</th>
                <th className="py-2 text-left pl-4">Product</th>
                <th className="py-2 text-left pl-4">Quantity</th>
                <th className="py-2 text-left pl-4">Price</th>
                <th className="py-2 text-left pl-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale?.products.map((product) => (
                <tr key={product._id} className="border-b border-neutral-500">
                  <td className="py-2 pl-4">
                    <Avatar
                      image={product.product.image}
                      withBorder={false}
                      fallbackImage="/utils/product-placeholder.png"
                    />
                  </td>
                  <td className="py-2 pl-4">{product.product.name}</td>
                  <td className="py-2 pl-4">
                    {product.quantity} {product.product.secondaryUnit}
                  </td>
                  <td className="py-2 pl-4">₹{product.sellingRate}</td>
                  <td className="py-2 pl-4">
                    ₹{product.sellingRate * product.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="totalAmount flex justify-end items-center gap-2">
            <p className="">Total Amount:</p>
            <p className="">₹{sale?.totalAmount}</p>
          </div>
        </div>

        {/* Supplier Information */}
        <Divider title="Biller Information" />
        <EmployeeCard employee={sale?.signedBy} />

      </div>
    </div>
  );
};

export default SaleDetails;
