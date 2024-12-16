import React from "react";
import ChipNav from "../utils/ChipNav";
import { BsBoxes } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import TrendingProducts from "../products/TrendingProducts";

const Products = () => {
  const navData = [
    {
      label: "View Products",
      icon: BsBoxes,
      to: "/products",
    },
    {
      label: "Add Product",
      icon: FaPlus,
      to: "/products/add",
    },
  ];
  return (
    <div className="flex-1 overflow-y-scroll flex flex-col p-3 w-full">
      <ChipNav chips={navData} baseUrl="/products" />
      <div className="flex-1 flex w-full max-sm:flex-col gap-3 max-h-full">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
          <Outlet />
        </div>
        <TrendingProducts />
      </div>
    </div>
  );
};

export default Products;
