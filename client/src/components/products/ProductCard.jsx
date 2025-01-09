import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import Modal from "../utils/Modal";
import ProductForm from "../products/ProductForm";

const ProductCardLarge = ({
  product = {},
  setRefetch = () => {},
  editable = true,
}) => {
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);

  return (
    <div className="min-h-fit">
      <div className="bg-[var(--color-card)] w-full rounded-lg border border-neutral-500/50 overflow-hidden shadow-lg">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="image w-full lg:w-1/4 aspect-[3/2] flex items-center justify-center rounded-l-md overflow-hidden bg-[var(--color-primary)]">
            <img
              src={product?.image || "/utils/product-placeholder.png"}
              alt="Placeholder"
              className="object-cover w-2/3 lg:w-full h-full"
              loading="lazy"
            />
          </div>

          {/* Details Section */}
          <div className="flex-1 px-3 md:px-4 lg:px-6">
            <div className="flex flex-col h-full ">
              {/* Header */}
              <div className="flex flex-col items-start my-2 w-full ">
                <div className="w-full flex items-center justify-between">
                  <h2 className="text-2xl max-sm:text-lg font-bold text-[var(--color-accent)] flex items-center gap-2">
                    {product?.name}
                  </h2>
                  <div className="text-right">
                    {editable && (
                      <MdEdit
                        className="cursor-pointer"
                        onClick={() => setEditProductModalOpen(true)}
                      />
                    )}
                  </div>
                </div>
                <p className="text-lg max-sm:text-sm font-semibold text-[var(--color-text)] mt-1">
                  {product.rate ? `₹${product.rate}` : "Price: Not Set"}
                </p>
                {product.upid && (
                  <p className="text-[var(--color-text-light)] max-sm:text-xs">
                    Product ID: {product.upid}
                  </p>
                )}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 flex-1 w-full justify-between my-2">
                {/* Left Column */}
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg max-sm:text-base font-semibold text-[var(--color-text)]">
                      Category Details
                    </h3>
                    <p className="text-[var(--color-text-light)]">
                      {product?.category}
                      {product?.subCategory && ` › ${product.subCategory}`}
                    </p>
                  </div>

                  <div className="">
                    <h3 className="text-lg max-sm:text-base font-semibold text-[var(--color-text)]">
                      Product Specifications
                    </h3>
                    <div className="my-1 flex flex-col justify-between">
                      <p className="text-[var(--color-text-light)]">
                        <span className="">Tax Rate:</span>{" "}
                        {product.tax ? `${product.tax}%` : "Not Set"}
                      </p>
                      {product?.shelfLife && (
                        <p className="text-[var(--color-text-light)]">
                          <span className="">Shelf Life:</span>{" "}
                          {product.shelfLife} days
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="">
                  {product.stockAlert?.preference && (
                    <div className="py-4 rounded-lg">
                      <h3 className="text-lg max-sm:text-base font-semibold ">
                        Stock Alert Settings
                      </h3>
                      <p className="text-[var(--color-text-light)]">
                        <span className="">Preference:</span>{" "}
                        {product.stockAlert.quantity} {product.secondaryUnit}
                      </p>
                    </div>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg max-sm:text-base font-semibold text-[var(--color-text)] mb-2">
                        Product Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-accent/80 text-white px-3 py-1 rounded-full text-sm max-sm:text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Editing Product */}
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
    </div>
  );
};

export default ProductCardLarge;
