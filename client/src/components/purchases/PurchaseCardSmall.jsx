import React from "react";
import Avatar from "../utils/Avatar";

const PurchaseCardSmall = ({ purchase }) => {
  const { signedBy, supplier, purchaseRate, quantity, createdAt, secondaryUnit } = purchase;

  return (
    <div className="bg-[var(--color-card)] shadow-md rounded-md p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[var(--color-text)] text-lg font-semibold">
          Purchase Details
        </h3>
        <span className="bg-accent text-[var(--color-text-light)] px-2 py-1 text-sm rounded-md">
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
          <p className="text-[var(--color-text-light)]">{quantity} {secondaryUnit}</p>
        </div>
      </div>

      {/* Supplier Info */}
      <div className="mb-3">
        <h4 className="text-[var(--color-text)] font-semibold">Supplier</h4>
        <p className="text-[var(--color-text-light)]">
          {supplier?.name} - {supplier?.email}
        </p>
      </div>

      {/* Signed By */}
      <div className="flex items-center mb-3 gap-2">
        <Avatar image={signedBy?.avatar} width={40} />
        <div>
          <p className="text-[var(--color-text)] font-medium">
            {signedBy?.name}
          </p>
          <p className="text-[var(--color-text-light)] text-sm">
            Role: {signedBy?.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCardSmall;
