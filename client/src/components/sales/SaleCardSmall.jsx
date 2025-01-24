import React from "react";
import Avatar from "../utils/Avatar";
import Divider from "../utils/Divider";
import { FaStore, FaUser } from "react-icons/fa";

const SaleCardSmall = ({ sale }) => {
  const {
    signedBy,
    customer,
    sellingRate,
    quantity,
    createdAt,
    secondaryUnit,
  } = sale;

  return (
    <div className="bg-[var(--color-card)] shadow-md border border-neutral-500/50 rounded-md p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[var(--color-text)] font-semibold">
          Sale Details
        </h3>
        <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-lg">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Purchase Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <h5 className="text-[var(--color-text)] font-semibold">Rate</h5>
          <p className="text-[var(--color-text-light)]">₹{sellingRate}</p>
        </div>
        <div>
          <h5 className="text-[var(--color-text)] font-semibold">Quantity</h5>
          <p className="text-[var(--color-text-light)]">
            {quantity} {secondaryUnit}
          </p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="my-3">
        <Divider title="Customer" />
        <div className="flex items-center gap-3">
          <FaUser className="text-3xl text-accent/70" />
          <div className="flex flex-col flex-1 w-4/5">
            <p>
              {customer?.name || customer?.phone || "No Data"}
              </p>
            <p className="text-[var(--color-text-light)] truncate text-ellipsis">{customer?.email || "No Email"}</p>
          </div>
        </div>
      </div>

      {/* Signed By */}
      <Divider title="Signed By" />
      <div className="flex items-center my-2 gap-3">
        <Avatar image={signedBy?.avatar} width={40} />
        <div>
          <p className="text-[var(--color-text)] font-medium capitalize">
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

export default SaleCardSmall;
