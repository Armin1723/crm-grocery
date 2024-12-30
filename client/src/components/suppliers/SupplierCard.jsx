import React from "react";
import { FaEdit, FaStore } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "../utils/Modal";
import SupplierForm from "./SupplierForm";

const SupplierCard = ({ supplier = {}, setRefetch = () => {} }) => {
  const user = useSelector((state) => state.user);
  const [editOpen, setEditOpen] = React.useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <>
      <div className="supplierInfo flex flex-col gap-3 w-full rounded-lg p-4 bg-[var(--color-card)] shadow-md transition-shadow hover:shadow-lg">
        {/* Header Section */}
        <div className="flex flex-wrap items-center gap-4">
          <FaStore className="text-5xl text-accent/70" />
          <div className="details flex-1">
            {/* Name and Edit Button */}
            <div className="flex items-center justify-between">
              <Link
                to={`/suppliers/${supplier?._id}`}
                className="text-lg font-semibold text-accent hover:underline truncate"
              >
                {supplier?.name || "Supplier Name"}
              </Link>
              {isAdmin && (
                <FaEdit
                  onClick={() => setEditOpen(true)}
                  className="text-accent/70 cursor-pointer hover:text-accent transition-colors"
                />
              )}
            </div>
            <p className="text-sm text-[var(--color-text-light)]">
              {supplier?.email || "Email not provided"}
            </p>
            <p className="text-sm text-[var(--color-text-light)]">
              {supplier?.phone || "Phone not provided"}
            </p>
          </div>
        </div>

        {/* Balance Section */}
        <div className="flex justify-start max-sm:justify-between items-center gap-2 bg-[var(--color-sidebar)] px-3 py-2 rounded-md text-sm">
          <p className="text-[var(--color-text)] font-medium">Balance:</p>
          <p
            className={`font-semibold ${
              supplier?.balance > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            ₹{supplier?.balance || "0.00"}
          </p>
        </div>

        {/* Additional Information */}
        <div className="additional-info grid grid-cols-2 max-sm:grid-cols-1 gap-3 mt-3 text-sm text-[var(--color-text-light)]">
          <div className="info-item">
            <span className="font-semibold">GSTIN:</span>
            <span className="ml-1">{supplier?.gstin || "Not provided"}</span>
          </div>
          <div className="info-item">
            <span className="font-semibold">PAN:</span>
            <span className="ml-1">{supplier?.pan || "Not provided"}</span>
          </div>
          <div className="info-item col-span-2 max-sm:col-span-1">
            <span className="font-semibold">Notes:</span>
            <span className="ml-1">
              {supplier?.notes || "No additional notes"}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <Modal
          title="Edit Supplier"
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
        >
          {/* Form */}
          <SupplierForm
            title="edit"
            supplier={supplier}
            closeModal={() => setEditOpen(false)}
            setRefetch={setRefetch}
          />
        </Modal>
      )}
    </>
  );
};

export default SupplierCard;
