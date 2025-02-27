import React, { useState } from "react";
import { formatDate } from "../utils";
import Avatar from "../utils/Avatar";
import { FaFileInvoice } from "react-icons/fa";
import Modal from "../utils/Modal";
import { Link } from "react-router-dom";

const SaleReturnCard = ({ saleReturn = {}, previewOnly = false }) => {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  return (
    <div className="flex flex-col rounded-md p-3 bg-[var(--color-card)]">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap text-xs">
        <h2 className="text-lg font-semibold">Return Summary</h2>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-[var(--color-accent)] text-white">
            {formatDate(saleReturn?.createdAt) || "Today"}
          </div>
          {!previewOnly && (
            <FaFileInvoice
              className="text-red-500 cursor-pointer hover:text-red-600"
              onClick={() => setInvoiceModalOpen(true)}
            />
          )}
          {invoiceModalOpen && (
            <Modal
              title="Sale Return Invoice"
              isOpen={invoiceModalOpen}
              onClose={() => setInvoiceModalOpen(false)}
            >
              <embed
                src={saleReturn?.invoice}
                type="application/pdf"
                width="100%"
                height="500px"
              />
            </Modal>
          )}
        </div>
      </div>

      {/* Biller Information */}
      <div className="flex items-center gap-3 mt-3 text-sm text-[var(--color-text-light)]">
        <span className="font-semibold">Returned By:</span>
        <Link
          to={`/employees/${saleReturn?.signedBy?.uuid}`}
          className="flex items-center gap-2 capitalize"
        >
          <Avatar
            image={saleReturn?.signedBy?.avatar}
            withBorder={true}
            fallbackImage="github.com/shadcn.png"
          />
          <p>{saleReturn?.signedBy?.name || "Unknown"}</p>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="retrunSummary mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-[var(--color-sidebar)]">
          <span className="text-xl font-bold ">
            {saleReturn?.totalAmount.toLocaleString() || "0"}₹
          </span>
          <p className="text-sm text-[var(--color-text-light)]">Total Amount</p>
        </div>

        {/* Individual Stat */}
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-[var(--color-sidebar)]">
          <span className="text-xl font-bold ">
            {saleReturn?.products?.reduce((acc, item) => {
              return acc + item.quantity;
            }, 0) || "0"}
          </span>
          <p className="text-sm text-[var(--color-text-light)]">Items</p>
        </div>
      </div>

      {/* Products */}
      <h3 className="my-2">Returned Products</h3>
      <div className="saleProducts flex flex-col gap-2 w-full rounded-md py-2 bg-[var(--color-card)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-primary)] text-neutral-600">
            <tr>
              <th className="py-2 text-left pl-4">Image</th>
              <th className="py-2 text-left pl-4">Product</th>
              <th className="py-2 text-left pl-4">Quantity</th>
              <th className="py-2 text-left pl-4">Price</th>
              <th className="py-2 text-left pl-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {saleReturn?.products.map((product) => (
              <tr key={product._id} className="border-b border-neutral-500/50">
                <td className="py-2 pl-4">
                  <Avatar
                    image={product?.product?.image}
                    withBorder={false}
                    fallbackImage="./utils/product-placeholder.png"
                  />
                </td>
                <td className="py-2 pl-4">{product?.product.name}</td>
                <td className="py-2 pl-4">
                  {product.quantity} {product?.product?.secondaryUnit}
                </td>
                <td className="py-2 pl-4">₹{product.sellingRate}</td>
                <td className="py-2 pl-4">
                  ₹{Math.ceil(product.sellingRate * product.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="totalAmount flex justify-end items-center gap-2 px-4 text-sm">
          <p className="">Total:</p>
          <p className="">₹{saleReturn?.totalAmount}</p>
        </div>
      </div>

      {/* Reason of Return */}
      <div className="mt-3 text-sm text-[var(--color-text-light)] flex flex-col gap-2">
        <span className="font-semibold">Reason:</span>
        <p className="truncate w-full bg-[var(--color-primary)] line-clamp-4 rounded-md p-3">
          {saleReturn?.reason}
        </p>
      </div>
    </div>
  );
};

export default SaleReturnCard;

