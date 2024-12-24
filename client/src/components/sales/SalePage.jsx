import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { SaleProvider } from "../../context/SaleContext";

const SalePage = () => {
  const [sale, setSale] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/${id}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (response.ok) {
          setSale(data.sale);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error fetching sale:", error.message);
      }
    };
    fetchSale();
  }, [id]);

  return (
    <div className="flex flex-col">
      <p>ID: {id}</p>
      <SaleProvider sale={sale}>
        <Outlet />
      </SaleProvider>
    </div>
  );
};

export default SalePage;
