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
    <div className="flex-1 overflow-y-auto flex flex-col p-3 w-full">
      <ChipNav chips={navData} baseUrl="/products" />
      <div className="flex-1 flex w-full flex-col xl:flex-row gap-3 overflow-y-auto ">
        <div className="flex-1 min-h-full xl:min-h-fit overflow-x-hidden">
          <Outlet />
        </div>
        <TrendingProducts />
      </div>
    </div>
  );
};

export default Products;
