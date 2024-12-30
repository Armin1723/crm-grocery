import React, { useState } from "react";
import { FaFileInvoice } from "react-icons/fa";
import Modal from "../utils/Modal";

const SaleDetailActions = ({ sale = {} }) => {
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShowInvoice(true)}
          className="flex items-center gap-2 rounded-lg font-medium text-red-600 hover:text-red-500 cursor-pointer shadow-sm hover:bg-gradient-to-tr transition-all duration-200"
        >
          <FaFileInvoice className="w-5 h-5" />
        </button>
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
    </>
  );
};

export default SaleDetailActions;
