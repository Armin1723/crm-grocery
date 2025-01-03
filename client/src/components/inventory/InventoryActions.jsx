import React, { useEffect, useState } from "react";
import { MdEdit, MdOutlineVideoLabel } from "react-icons/md";
import Modal from "../utils/Modal";
import EditBatchForm from "./EditBatchForm";
import BatchLabel from "./BatchLabel";
import { HiDotsVertical } from "react-icons/hi";

const InventoryActions = ({
  batch = {},
  inventory = {},
  upid = "",
  setRefetch = () => {},
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = React.useRef(null);

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
      className="relative flex items-center px-4 py-2 rounded-md gap-2 cursor-pointer font-normal"
    >
      {/* Button */}
      <div
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter") toggleMenu();
        }}
        className="button-title text-sm flex gap-2 items-center transition-all duration-300 ease-in rounded-md px-3 py-1.5"
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
        } absolute menu overflow-hidden top-full -left-1/2 !z-[999] bg-[var(--color-card)] transition-all duration-300 ease-in min-w-[120px] rounded-md py-1 flex flex-col border-neutral-500/50 border shadow-md`}
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
          <MdEdit className="" title="Edit Batch" />
          <p className="capitalize">Edit</p>
        </div>
        <div
          className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
          role="menuitem"
          tabIndex={0}
          onClick={() => {
            setMenuOpen(false);
            setLabelModalOpen(true);
          }}
        >
          <MdOutlineVideoLabel title="Print Batch Label" />
          <p className="capitalize">Label</p>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal
          title="Edit Batch"
          onClose={() => setEditModalOpen(false)}
          isOpen={editModalOpen}
        >
          <EditBatchForm
            batch={batch}
            setRefetch={setRefetch}
            upid={upid}
            closeModal={() => setEditModalOpen(false)}
          />
        </Modal>
      )}

      {/* Label Modal */}
      {labelModalOpen && (
        <Modal
          title="Batch Label"
          onClose={() => setLabelModalOpen(false)}
          isOpen={labelModalOpen}
        >
          <BatchLabel
            inventory={inventory}
            batch={batch}
            closeModal={() => setLabelModalOpen(false)}
            setRefetch={setRefetch}
          />
        </Modal>
      )}
    </div>
  );
};

export default InventoryActions;
