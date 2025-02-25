import React from "react";
import {
  FaUser,
  FaEdit,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWallet,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "../utils/Modal";
import CustomerForm from "./CustomerForm";
import CustomerPaymentForm from "./CustomerPaymentForm";

const CustomerCard = ({ customer = {}, setRefetch = () => {} }) => {
  const user = useSelector((state) => state.user);

  const [editOpen, setEditOpen] = React.useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <>
      <div className="customerInfo flex flex-col gap-3 w-full rounded-lg p-4 bg-[var(--color-card)] shadow-md transition-shadow hover:shadow-lg">
        {/* Header Section */}
        <div className="flex flex-wrap items-center gap-4">
          <FaUser className="text-5xl text-accent/70" />
          <div className="details flex-1">
            {/* Name and Edit Button */}
            <div className="flex items-center justify-between">
              <Link
                to={`/customers/${customer?._id}`}
                className="text-lg font-semibold text-accent hover:underline truncate"
              >
                {customer?.name || "Customer Name"}
              </Link>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <FaEdit
                    onClick={() => setEditOpen(true)}
                    className="text-accent/70 cursor-pointer hover:text-accent transition-colors"
                  />
                )}
                <FaWallet
                  title="Add Payment"
                  onClick={() => setPaymentModalOpen(true)}
                  className="text-accent/70 cursor-pointer hover:text-accent transition-colors"
                />
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-light)]">
              <FaEnvelope className="inline-block mr-2 text-gray-500" />
              {customer?.email || "Email not provided"}
            </p>
            <p className="text-sm text-[var(--color-text-light)]">
              <FaPhoneAlt className="inline-block mr-2 text-gray-500" />
              {customer?.phone || "Phone not provided"}
            </p>
          </div>
        </div>

        {/* Balance Section */}
        <div className="flex justify-start max-sm:justify-between items-center gap-2 bg-[var(--color-sidebar)] px-3 py-2 rounded-md text-sm">
          <p className="text-[var(--color-text)] font-medium">Balance:</p>
          <p
            className={`font-semibold ${
              customer?.balance > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            ₹{customer?.balance?.toFixed(2) || "0.00"}
          </p>
        </div>

        {/* Additional Information */}
        <div className="additional-info grid grid-cols-2 max-sm:grid-cols-1 gap-3 mt-3 text-sm text-[var(--color-text-light)]">
          <div className="info-item col-span-2 max-sm:col-span-1">
            <FaMapMarkerAlt className="inline-block mr-2 text-gray-500" />
            <span className="font-semibold">Address:</span>
            <span className="ml-1">{customer?.address || "Not provided"}</span>
          </div>
          {customer?.description && (
            <div className="info-item col-span-2 max-sm:col-span-1">
              <span className="font-semibold">Notes:</span>
              <span className="ml-1">{customer?.description}</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <Modal
          title="Edit Customer"
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
        >
          <CustomerForm
            title="edit"
            customer={customer}
            closeModal={() => setEditOpen(false)}
            expanded
            setRefetch={setRefetch}
          />
        </Modal>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && (
        <Modal
          title="Add Payment"
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        >
          <CustomerPaymentForm
            customer={customer}
            closeModal={() => setPaymentModalOpen(false)}
            expanded
            setRefetch={setRefetch}
          />
        </Modal>
      )}
    </>
  );
};

export default CustomerCard;
