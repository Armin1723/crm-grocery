import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEdit, FaKey } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import Modal from "../utils/Modal";
import EmployeeForm from "./EmployeeForm";
import PermissionsForm from "./PermissionsForm";

const EmployeeActions = ({ employee, setRefetch = () => {} }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);

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
        } absolute menu overflow-hidden top-full -left-full !z-[999] bg-[var(--color-card)] transition-all duration-300 ease-in min-w-[120px] rounded-md py-1 flex flex-col gap-1 border-neutral-500/50 border shadow-md`}
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

        {employee?.role !== "admin" && (
          <div
            className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              setMenuOpen(false);
              setPermissionModalOpen(true);
            }}
          >
            <FaKey />
            <p className="capitalize">Permissions</p>
          </div>
        )}

        <Link
          to={`/employees/${employee?.uuid}`}
          className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
          role="menuitem"
        >
          <FaEye />
          <p className="capitalize">View</p>
        </Link>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit ${employee?.name}`}
        >
          {/* Modal Content for editing employee */}
          <EmployeeForm
            employee={employee}
            title="edit"
            closeModal={() => setEditModalOpen(false)}
            setRefetch={setRefetch}
          />
        </Modal>
      )}

      {/* Permission Modal */}
      {permissionModalOpen && (
        <Modal
          isOpen={permissionModalOpen}
          onClose={() => setPermissionModalOpen(false)}
          title={`Edit permissions for ${employee?.name}`}
        >
          {/* Modal Content for editing employee permissions */}
          <PermissionsForm
            employee={employee}
            closeModal={() => setPermissionModalOpen(false)}
            setRefetch={setRefetch}
          />
        </Modal>
      )}
    </div>
  );
};

export default EmployeeActions;
