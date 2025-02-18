import React, { useState, useEffect, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaPaperPlane, FaExchangeAlt } from "react-icons/fa";
import Modal from "../utils/Modal";
import TicketResponseForm from "./TicketResponseForm";
import TicketStatusForm from "./TicketStatusForm";

const TicketActions = ({ ticket, setRefetch = () => {} }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const menuRef = useRef(null);

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

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div
      ref={menuRef}
      className="relative flex items-center px-4 py-2 rounded-md gap-2 cursor-pointer"
    >
      <div
        onClick={toggleMenu}
        className="button-title bg-[var(--color-card)] text-sm flex gap-2 items-center transition-all duration-300 ease-in rounded-md border border-neutral-500/50 px-3 py-1.5"
        tabIndex={0}
        role="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <HiDotsVertical />
      </div>

      <div
        className={`${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } absolute menu overflow-hidden top-full -left-full !z-[999] bg-[var(--color-card)] transition-all duration-300 ease-in min-w-[150px] rounded-md py-1 flex flex-col gap-1 border-neutral-500/50 border shadow-md`}
        role="menu"
        aria-hidden={!menuOpen}
      >
        {!ticket.response && (
          <div
            className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              setMenuOpen(false);
              setResponseModalOpen(true);
            }}
          >
            <FaPaperPlane />
            <p className="capitalize">Send Response</p>
          </div>
        )}

        <div
          className="menu-item px-4 py-1 text-sm text-center hover:bg-accentDark/10 cursor-pointer transition-all duration-200 ease-in flex items-center gap-2"
          role="menuitem"
          tabIndex={0}
          onClick={() => {
            setMenuOpen(false);
            setStatusModalOpen(true);
          }}
        >
          <FaExchangeAlt />
          <p className="capitalize">Change Status</p>
        </div>
      </div>

      {responseModalOpen && (
        <Modal
          isOpen={responseModalOpen}
          onClose={() => setResponseModalOpen(false)}
          title="Send Response"
        >
          <TicketResponseForm
            ticket={ticket}
            closeModal={() => setResponseModalOpen(false)}
            setRefetch={setRefetch}
          />
        </Modal>
      )}

      {statusModalOpen && (
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title="Change Ticket Status"
        >
          <TicketStatusForm
            ticket={ticket}
            closeModal={() => setStatusModalOpen(false)}
            setRefetch={setRefetch}
          />
        </Modal>
      )}
    </div>
  );
};

export default TicketActions;
