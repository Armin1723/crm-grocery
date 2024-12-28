import React, { useState, useEffect, useRef } from "react";
import { FaFileInvoice } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const InventoryActionButton = ({product}) => {

      const [menuOpen, setMenuOpen] = useState(false);
      const menuRef = useRef(null);
    
      const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
    
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
            } absolute menu overflow-hidden top-full -left-1/2 !z-[999] bg-[var(--color-card)] transition-all duration-300 ease-in min-w-[120px] rounded-md py-1 flex flex-col gap-2 border-neutral-500/50 border shadow-md`}
            role="menu"
            aria-hidden={!menuOpen}
          >
            <div
              className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
              role="menuitem"
              tabIndex={0}
              onClick={() => {
                setMenuOpen(false);
                setInvoiceModalOpen(true);
              }}
            >
              <FaFileInvoice />
              <p className="capitalize"></p>
            </div>
    
            <Link
              to={`/purchases/${product?._id}`}
              className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
              role="menuitem"
              tabIndex={0}
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              <MdDelete />
              <p className="capitalize">Delete</p>
            </Link>
          </div>
    
          {/* Edit Modal */}
          {invoiceModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
              <div className="bg-[var(--color-sidebar)] rounded-md p-6 w-1/2 max-sm:w-[90%] overflow-y-auto max-h-[90vh] max-sm:px-6">
                <div className="flex items-center gap-2 w-full justify-between my-4">
                  <h2 className="text-lg font-bold ">View Invoice</h2>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                    onClick={() => setInvoiceModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
                {/* Modal Content for Editing */}
                <div>
                    <embed src={product?.invoice} type="application/pdf" width="100%" height="500px" />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };
    

export default InventoryActionButton
