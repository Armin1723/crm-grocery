import React from "react";
import { FaSave } from "react-icons/fa";
import { IoReloadCircleSharp } from "react-icons/io5";
import { MdLockReset } from "react-icons/md";
import { toast } from "react-toastify";

const SaveReload = ({ products = [], setProducts = () => {}, name = "" }) => {
  return (
    <div className="flex justify-between items-center gap-2 pr-2">
      <button
        onClick={(e) => {
          e.preventDefault();
          if (!products.length) {
            toast.error("No data to save");
            return;
          }
          localStorage.setItem(name, JSON.stringify(products));
          toast.success("Data saved successfully");
        }}
        className="cursor-pointer text-green-700 hover:text-green-800"
        title="Save data"
      >
        <FaSave />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          const savedSale = JSON.parse(localStorage.getItem(name));
          if (savedSale) {
            setProducts(savedSale);
            toast.success("Data loaded successfully");
          } else {
            toast.error("No saved data found");
          }
        }}
        title="Reload saved data"
        className="cursor-pointer text-blue-700 hover:text-blue-800"
      >
        <IoReloadCircleSharp />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          setProducts([]);
          toast.success("Data cleared successfully");
        }}
        className="cursor-pointer text-red-600 hover:text-red-700"
        title="Clear data"
      >
        <MdLockReset />
      </button>
    </div>
  );
};

export default SaveReload;
