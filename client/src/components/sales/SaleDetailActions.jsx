import React, { useState } from "react";
import { FaFileInvoice } from "react-icons/fa";
import Modal from "../utils/Modal";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SaleDetailActions = ({ sale = {} }) => {
  const user = useSelector((state) => state.user);
  const [showInvoice, setShowInvoice] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const preDelete = () => {
    const isAnyProductExpired = sale?.products?.some((product) => {
      return product?.expiry && new Date(product?.expiry) < new Date();
    });

    if (isAnyProductExpired) {
      toast.error("Cannot delete! Some products are expired.");
    } else {
      setDeleteModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/${id}`, {
        credentials: "include",
        method: "DELETE"
      })
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      toast.success(data.message);
      navigate("/sales")
    } catch (error) {
      console.error("Error deleting sale:", error.message);
      toast.error(error.message);
    }
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShowInvoice(true)}
          className="flex items-center rounded-lg font-medium text-red-500 hover:text-red-500/80 cursor-pointer shadow-sm hover:bg-gradient-to-tr transition-all duration-200"
        >
          <FaFileInvoice className="w-4 h-4" />
        </button>
        {isAdmin && (
          <button className="flex items-center rounded-lg font-medium text-red-600 hover:text-red-600/80 cursor-pointer shadow-sm hover:bg-gradient-to-tr transition-all duration-200">
            <MdDelete className="w-5 h-5" onClick={preDelete} />
          </button>
        )}
      </div>

      <Modal
        isOpen={showInvoice}
        title="Invoice"
        onClose={() => setShowInvoice(false)}
      >
        <embed
          src={sale?.invoice}
          type="application/pdf"
          width="100%"
          height="500px"
        />
      </Modal>

      {deleteModalOpen && (
        <Modal
          isOpen={deleteModalOpen}
          title="Delete Sale"
          onClose={() => setDeleteModalOpen(false)}
        >
          <div className="flex flex-col gap-4">
            <p>Are you sure you want to delete this sale?</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  handleDelete(sale?._id);
                }}
                className="flex-1 p-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all duration-200"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 p-2 rounded-lg text-red-500 border border-red-500 hover:bg-red-500/20 transition-all duration-200"
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SaleDetailActions;
