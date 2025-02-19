import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProductCardSmall = ({
  product = {},
}) => {

  const user = useSelector((state) => state.user);

  return (
      <div className="bg-[var(--color-card)] flex-shrink-0 w-full h-full rounded-md p-4 transition-all flex flex-col justify-between border border-neutral-500/50 min-w-[20vw]">
        {/* Product Image */}
        <div className="w-full h-48 bg-[var(--color-sidebar)] rounded-md overflow-hidden flex ">
          <img
            src={product?.image || "./utils/product-placeholder.png"}
            alt={product?.name}
            loading="lazy"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col mt-4 flex-grow">
          {/* Product Name */}
          <Link
            to={`${user?.role === 'admin' ? '' : '/seller'}/products/${product?.upid}`}
            className="text-[var(--color-text)] text-lg text-wrap font-semibold truncate flex items-center gap-2 hover:underline"
          >
            {product?.name}
          </Link>
          <p className="text-[var(--color-text)] font-semibold">
            {product?.mrp ? `₹${product?.mrp}` : "MRP: Not Set"}
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
            {product.tags?.slice(0,2).map((tag, index) => (
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
            <p className="text-[var(--color-text-light)] text-sm mt-2">
              <strong>Stock Alert:</strong> {product.stockAlert.quantity}{" "}{product?.secondaryUnit}
            </p>
          )}
        </div>

        {/* Product Pricing & Footer */}
        <p className="text-[var(--color-text-light)] text-sm">
          <strong>Tax:</strong> {product.tax ? product.tax : 'Not Set'}%
        </p>
        {product?.upid && (
          <p className="text-[var(--color-text-light)] text-sm mt-1 truncate">
            <strong>Product ID:</strong> {product.upid}
          </p>
        )}
      </div>
  );
};

export default ProductCardSmall;
