import React, { useState } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM for portal
import { MdEdit } from "react-icons/md";
import Modal from "../utils/Modal";
import CustomerForm from "./CustomerForm";

const AddCustomerModal = ({ setValue = () => {} }) => {
  const [addCustomerModal, setAddCustomerModal] = useState(false);

  return (
    <div>
      <MdEdit
        onClick={() => setAddCustomerModal(true)}
        className="cursor-pointer"
      />

      {/* Add Customer Modal as React Portal */}
      {addCustomerModal &&
        ReactDOM.createPortal(
          <Modal
            isOpen={addCustomerModal}
            onClose={() => setAddCustomerModal(false)}
            title="Add Customer"
          >
            <CustomerForm
              setValue={setValue}
              closeModal={() => setAddCustomerModal(false)}
            />
          </Modal>,
          document.body 
        )}
    </div>
  );
};

export default AddCustomerModal;
