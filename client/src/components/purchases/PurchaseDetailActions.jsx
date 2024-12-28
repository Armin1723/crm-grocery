import React, { useState } from "react";
import { FaFileInvoice, FaCreditCard } from "react-icons/fa";
import PurchaseTimeline from "./PurchaseTimeline";
import Modal from "../utils/Modal";

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
