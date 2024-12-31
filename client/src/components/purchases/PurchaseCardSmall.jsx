import React from "react";
import Avatar from "../utils/Avatar";
import Divider from "../utils/Divider";
import { Link } from "react-router-dom";
import { FaStore } from "react-icons/fa";

const PurchaseCardSmall = ({ purchase }) => {
  const {
    signedBy,
    supplier,
    purchaseRate,
    quantity,
    createdAt,
    secondaryUnit,
  } = purchase;

  return (
    <div className="bg-[var(--color-card)] shadow-md border border-neutral-500/50 rounded-md p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[var(--color-text)] font-semibold">
          Purchase Details
        </h3>
        <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-lg">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Purchase Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <h5 className="text-[var(--color-text)] font-semibold">Rate</h5>
          <p className="text-[var(--color-text-light)]">₹{purchaseRate}</p>
        </div>
        <div>
          <h5 className="text-[var(--color-text)] font-semibold">Quantity</h5>
          <p className="text-[var(--color-text-light)]">
            {quantity} {secondaryUnit}
          </p>
        </div>
      </div>

      {/* Supplier Info */}
      <div className="my-3">
        <Divider title="Supplier" />
        <div className="flex items-center gap-3">
          <FaStore className="text-3xl text-accent/70" />
          <div className="flex flex-col">
            <Link
              to={`/suppliers/${supplier?._id}`}
              className="hover:underline"
            >
              {supplier?.name}
            </Link>
            <p className="text-[var(--color-text-light)]">{supplier?.email}</p>
          </div>
        </div>
      </div>

      {/* Signed By */}
      <Divider title="Signed By" />
      <div className="flex items-center my-2 gap-3">
        <Avatar image={signedBy?.avatar} width={40} />
        <div>
          <p className="text-[var(--color-text)] font-medium">
            {signedBy?.name}
          </p>
          <p className="text-[var(--color-text-light)] text-sm">
            Role:{" "}
            <span
              className={`${
                signedBy?.role === "admin"
                  ? "bg-accent text-white"
                  : "bg-green-600 text-white"
              } px-2 rounded-lg capitalize`}
            >
              {signedBy?.role}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCardSmall;
