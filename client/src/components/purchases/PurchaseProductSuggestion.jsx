import React, { useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const PurchaseProductSuggestion = ({
  products = [],
  setProducts = () => {},
  suggestedProducts = [],
  setSuggestedProducts = () => {},
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  const fetchSuggestedProducts = async (e) => {
    const value = e.target.value.trim();
    if (value.length > 1) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/products?name=${value}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (response.ok) {
          setSuggestedProducts(data.products);
        } else {
          throw new Error(data.message || "Failed to fetch suggested products");
        }
      } catch (error) {
        console.error("Error fetching suggested products:", error.message);
      }
    } else {
      setSuggestedProducts([]);
    }
    setSelectedIndex(-1);
  };

  const handleAddProduct = (product) => {
    const isMatch = products.some((p) => p.name === product.name)
        

    if (isMatch) {
      toast.error("Product already added", { autoClose: 2000 });
      inputRef.current.value = "";
      setSuggestedProducts([]);
      setSelectedIndex(-1);
      return;
    }

    setProducts((prev) => [
      ...prev, {
        ...product,
        quantity: 1,
      }
    ]);

    setSuggestedProducts([]);
    setSelectedIndex(-1);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleKeyDown = (e) => {
    if (!suggestedProducts.length) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestedProducts.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestedProducts.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleAddProduct(suggestedProducts[selectedIndex]);
    }
  };

  return (
    <div
      className="searchBar relative max-w-[70%] max-sm:text-sm flex items-center border border-neutral-500 rounded-md mr-3"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="rounded-s-md px-3 py-2 bg-[var(--color-card)]">
        <FaSearch />
      </div>
      <input
        type="text"
        placeholder="Search for product"
        className="bg-transparent outline-none rounded-md p-1"
        onChange={fetchSuggestedProducts}
        ref={inputRef}
      />

      <div className="suggested-products w-full absolute top-full left-0 z-[99] bg-[var(--color-card)] rounded-b-md shadow-md border border-neutral-500/50">
        {suggestedProducts.length > 0 &&
          suggestedProducts.map((product, index) => (
            <div
              key={product._id}
              className={`supplier-option px-3 py-2 w-full flex items-center justify-between text-sm hover:bg-accentDark/20 transition-all duration-300 ease-in cursor-pointer ${
                index === selectedIndex ? "bg-accentDark/20" : ""
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => handleAddProduct(product)}
            >
              <p>{product.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PurchaseProductSuggestion;
