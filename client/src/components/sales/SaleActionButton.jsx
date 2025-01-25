import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SaleActionButton = ({ sale, setRefetch = () => {} }) => {
  const user = useSelector((state) => state.user);
  const isAdmin = user && user?.role === "admin";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const generateInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/${sale?._id}/invoice`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setRefetch((prev) => !prev);
      toast.success("Invoice generated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to generate invoice");
      console.error("Error generating invoice:", error.message);
    } finally {
      setInvoiceModalOpen(false);
      setLoading(false);
    }
  };

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
            setInvoiceModalOpen(true);
          }}
        >
          <FaFileInvoice />
          <p className="capitalize">Invoice</p>
        </div>

          <Link
            to={isAdmin ? `/sales/${sale?._id}` : `/seller/sales/${sale?._id}`}
            className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            <FaEye />
            <p className="capitalize">View</p>
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
            {/* Modal Content */}
            <div>
              {sale.invoice ? (
                <embed
                  src={sale?.invoice}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                />
              ) : (
                <button
                  onClick={generateInvoice}
                  disabled={loading}
                  className="bg-accent text-white px-3 py-1 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {loading ? "Generating..." : "Generate Invoice"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleActionButton;
