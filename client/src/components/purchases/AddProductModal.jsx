import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ProductForm from "../products/ProductForm";

const AddProductModal = () => {
    const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setAddProductModalOpen(true)}
        className="h-full text-xs md:text-sm px-3 py-1 max-sm:py-2 flex items-center gap-2 border border-accent bg-accent/10 hover:bg-accentDark/20 rounded-md transition-all duration-300"
      >
        <FaPlus className="text-sm"/>
        <span className="max-sm:hidden">New Product</span>
      </button>

       {/* Add Product Modal */}
       {addProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-[var(--color-sidebar)] rounded-md p-6 w-1/2 max-sm:w-[90%] overflow-y-auto max-h-[90vh] max-sm:px-6">
            <div className="flex items-center gap-2 w-full justify-between my-4">
              <h2 className="text-lg font-bold ">Add Product.</h2>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => setAddProductModalOpen(false)}
              >
                Close
              </button>
            </div>
            {/* Modal Content for setting alert */}
            <ProductForm closeModal={() => setAddProductModalOpen(false)}/>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductModal;
