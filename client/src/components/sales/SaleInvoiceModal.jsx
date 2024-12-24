import React, { useState } from "react";
import { useSale } from "../../context/SaleContext";
const SaleInvoiceModal = () => {

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(true);

  const sale = useSale();

  return (
    <div
      className="relative flex items-center px-4 py-2 rounded-md gap-2 cursor-pointer"
    >
        <button onClick={()=>setInvoiceModalOpen(true)}>Invoice</button>

      {/* Edit Modal */}
      {invoiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div  className="bg-[var(--color-sidebar)] rounded-md p-6 w-3/4 max-sm:w-[90%] overflow-y-auto max-h-[90vh] max-sm:px-6">
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
                <embed src={sale?.invoice} type="application/pdf" width="100%" height="500px" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleInvoiceModal;
