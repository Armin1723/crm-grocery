import React, { useState } from "react";
import { FaFileInvoice, FaCreditCard } from "react-icons/fa";
import PurchaseTimeline from "./PurchaseTimeline";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="bg-[var(--color-sidebar)] rounded-md p-6 w-1/2 max-sm:w-[90%] overflow-hidden max-h-[90vh] max-sm:px-6">
        <div className="flex items-center gap-2 w-full justify-between my-4">
          <h2 className="text-lg font-bold ">{title}</h2>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[60vh]">{children}</div>
      </div>
    </div>
  );
};

const PurchaseDetailActions = ({ purchase = {} }) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShowInvoice(true)}
          className="flex items-center gap-2 rounded-lg font-medium text-red-600 hover:text-red-500 cursor-pointer shadow-sm hover:bg-gradient-to-tr transition-all duration-200"
        >
          <FaFileInvoice className="w-5 h-5" />
          {/* <span>Invoice</span> */}
        </button>

        {purchase?.followUpPayments?.length > 0 && (
          <button
            onClick={() => setShowFollowUp(true)}
            className="flex items-center gap-2 rounded-lg font-medium text-blue-600 hover:text-blue-500 cursor-pointer shadow-sm hover:bg-gradient-to-tr transition-all duration-200"
        >
            <FaCreditCard className="w-5 h-5" />
          </button>
        )}
      </div>

      <Modal
        isOpen={showInvoice}
        title="Invoice"
        onClose={() => setShowInvoice(false)}
      >
        <embed
          src={purchase?.invoice}
          type="application/pdf"
          width="100%"
          height="500px"
        />
      </Modal>

      <Modal
        isOpen={showFollowUp}
        title="Follow up Payment"
        onClose={() => setShowFollowUp(false)}
      >
        <PurchaseTimeline purchase={purchase} />
      </Modal>
    </>
  );
};

export default PurchaseDetailActions;
