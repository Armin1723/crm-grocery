import React, { useState, useEffect, useRef } from "react";
import { FaCreditCard, FaEye, FaFileInvoice } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import PurchaseTimeline from "./PurchaseTimeline";
import { Link } from "react-router-dom";
import Modal from "../utils/Modal";

const PurchaseActionButton = ({ purchase, setRefetch = () => {} }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);

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
            setInvoiceModalOpen(true);
          }}
        >
          <FaFileInvoice />
          <p className="capitalize">Invoice</p>
        </div>

        <Link
          to={`/purchases/${purchase?._id}`}
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

        {(purchase?.deficitAmount > 0  || purchase?.followUpPayments.length > 0) && (
          <div
            className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              setMenuOpen(false);
              setFollowUpModalOpen(true);
            }}
          >
            <FaCreditCard />
            <p className="capitalize">Follow Up</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {invoiceModalOpen && (
        <Modal
          isOpen={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
          title="Invoice"
        >
          {/* Modal Content for Editing */}
          <div>
            <embed
              src={purchase?.invoice}
              type="application/pdf"
              width="100%"
              height="500px"
            />
          </div>
        </Modal>
      )}

      {/* Follow Up Payment Modal */}
      {followUpModalOpen && (
        <Modal
          isOpen={followUpModalOpen}
          onClose={() => setFollowUpModalOpen(false)}
          title="Follow Up Payment"
        >
          {/* Modal Content for Editing */}
            <PurchaseTimeline
              purchase={purchase}
              closeModal={() => setFollowUpModalOpen(false)}
              setRefetch={setRefetch}
            />
        </Modal>
      )}
    </div>
  );
};

export default PurchaseActionButton;
