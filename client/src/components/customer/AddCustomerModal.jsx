import React, { useState } from "react";
import ReactDOM from "react-dom";
import { MdEdit } from "react-icons/md";
import Modal from "../utils/Modal";
import CustomerForm from "./CustomerForm";
import { FaFolderPlus } from "react-icons/fa";

const AddCustomerModal = ({
  title = "add",
  setValue = () => {},
  customer = {},
}) => {
  const [addCustomerModal, setAddCustomerModal] = useState(false);

  return (
    <div>
      {title === "add" ? (
        <FaFolderPlus
          onClick={() => setAddCustomerModal(true)}
          className={`cursor-pointer text-xs ${customer && customer.phone && "hidden"}`}
        />
      ) : (
        <MdEdit
          onClick={() => setAddCustomerModal(true)}
          className="cursor-pointer"
        />
      )}

      {/* Add Customer Modal as React Portal */}
      {addCustomerModal &&
        ReactDOM.createPortal(
          <Modal
            isOpen={addCustomerModal}
            onClose={() => setAddCustomerModal(false)}
            title={<p className="text-[var(--color-text)] capitalize">{title} Customer</p>}
          >
            <CustomerForm
              title={title}
              setValue={setValue}
              customer={customer}
              closeModal={() => setAddCustomerModal(false)}
            />
          </Modal>,
          document.body
        )}
    </div>
  );
};

export default AddCustomerModal;
