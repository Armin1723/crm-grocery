import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaEdit, FaSync } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import AlertForm from "./AlertForm";
import { toast } from "react-toastify";
import Modal from "../utils/Modal";

const ProductActionButton = ({ product, setRefetch = () => {} }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const autoRateProduct = async () => {
    const id = toast.loading("Setting Rate Automatically...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/${
          product._id
        }/auto-set-rate`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to set rate automatically");
      }
      toast.update(id, {
        render: "Rate Set Successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setRefetch((prev) => !prev);
    } catch (error) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Toggle menu visibility
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div
      ref={menuRef}
      className="relative flex items-center px-4 py-2 rounded-md gap-2 cursor-pointer"
    >
      {/* Button */}
      <div
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter") toggleMenu();
        }}
        className="button-title bg-[var(--color-card)] text-sm flex gap-2 items-center transition-all duration-300 ease-in rounded-md border border-neutral-500/50 px-3 py-1.5"
        tabIndex={0}
        role="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <HiDotsVertical />
      </div>

      {/* Dropdown Menu */}
      <div
        className={`${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } absolute menu overflow-hidden top-full -left-1/2 !z-[999] bg-[var(--color-card)] transition-all duration-300 ease-in min-w-[120px] rounded-md py-1 flex flex-col gap-1 border-neutral-500/50 border shadow-md`}
        role="menu"
        aria-hidden={!menuOpen}
      >
        <div
          className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
          role="menuitem"
          tabIndex={0}
          onClick={() => {
            setMenuOpen(false);
            setEditModalOpen(true);
          }}
        >
          <FaEdit />
          <p className="capitalize">Edit</p>
        </div>

        <div
          className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
          role="menuitem"
          tabIndex={0}
          onClick={() => {
            setMenuOpen(false);
            setAlertModalOpen(true);
          }}
        >
          <FaBell />
          <p className="capitalize">Set Alert</p>
        </div>

        {!product.rate && (
          <div
            className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              setMenuOpen(false);
              autoRateProduct();
            }}
          >
            <FaSync />
            <p className="capitalize">Auto Rate</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-[var(--color-sidebar)] rounded-md p-6 w-2/3 max-sm:w-[90%] overflow-y-auto max-h-[90vh] max-sm:px-6">
            <div className="flex items-center gap-2 w-full justify-between my-4">
              <h2 className="text-lg font-bold ">Edit Product</h2>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => setEditModalOpen(false)}
              >
                Close
              </button>
            </div>
            {/* Modal Content for Editing */}
            <div>
              <ProductForm
                product={product}
                title="edit"
                setRefetch={setRefetch}
                closeModal={() => setEditModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Set Alert Modal */}
      {alertModalOpen && (
        <Modal
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          title="Set Alert"
        >
          {/* Modal Content for setting alert */}
          <AlertForm
            product={product}
            closeModal={() => setAlertModalOpen(false)}
            setRefetch={setRefetch}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductActionButton;
