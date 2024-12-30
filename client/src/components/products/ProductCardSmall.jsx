import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import Modal from "../utils/Modal";
import ProductForm from "../products/ProductForm";

const ProductCardSmall = ({
  product = {},
  setRefetch = () => {},
  editable = true,
}) => {
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[var(--color-card)] flex-shrink-0 w-full h-full rounded-md p-4 transition-all flex flex-col justify-between border border-neutral-500/50">
        {/* Product Image */}
        <div className="w-full h-48 bg-[var(--color-sidebar)] rounded-md overflow-hidden">
          <img
            src={product?.image || '/utils/product-placeholder.png'}
            alt={product?.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col mt-4 flex-grow">
          {/* Product Name */}
          <h3 className="text-[var(--color-text)] text-lg text-wrap font-semibold truncate flex items-center gap-2">
            {product?.name}
            {editable && (
              <MdEdit
                className="cursor-pointer"
                onClick={() => setEditProductModalOpen(true)}
              />
            )}
          </h3>
          <p className="text-[var(--color-text)] font-semibold">
            {product.rate ? `₹${product.rate}` : "Price: Not Set"}
          </p>

          {/* Product Category & Subcategory */}
          <p className="text-[var(--color-text-light)] text-sm mt-1 truncate">
            <strong>Category:</strong> {product?.category}
          </p>
          {product.subCategory && (
            <p className="text-[var(--color-text-light)] text-sm">
              <strong>Subcategory:</strong> {product?.subCategory}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-accent/80 text-xs text-white px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Product Shelf Life */}
          {product?.shelfLife && (
            <p className="text-[var(--color-text-light)] text-sm mt-2">
              <strong>Shelf Life:</strong> {product.shelfLife} days
            </p>
          )}

          {/* Stock Alert */}
          {product.stockAlert?.preference && (
            <p className="text-[var(--color-accent)] text-sm mt-2">
              <strong>Stock Alert:</strong> Enabled
            </p>
          )}
        </div>

        {/* Product Pricing & Footer */}
        <p className="text-[var(--color-text-light)] text-sm">
          <strong>Tax:</strong> {product.tax}%
        </p>
        {product.upid && (
          <p className="text-[var(--color-text-light)] text-sm mt-1 truncate">
            <strong>Product ID:</strong> {product.upid}
          </p>
        )}
      </div>

      {editProductModalOpen && (
        <Modal
          title="Edit Product"
          onClose={() => setEditProductModalOpen(false)}
          isOpen={editProductModalOpen}
        >
          <ProductForm
            title="edit"
            product={product}
            setRefetch={setRefetch}
            closeModal={() => setEditProductModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default ProductCardSmall;
