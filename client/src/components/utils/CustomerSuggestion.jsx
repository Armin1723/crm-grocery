import React, { useState, useRef } from "react";

const CustomerSuggestion = ({ setCustomerDetails = () => {}, type = "name" }) => {
  const [suggestedCustomers, setSuggestedCustomers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const fetchCustomerByName = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (type === "phone" && value.length === 10) {
      setCustomerDetails({ phone: value });
    } else {
      setCustomerDetails(null);
    }

    if (!value) {
      setSuggestedCustomers([]);
      setDropdownVisible(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/customers?query=${value}`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (response.ok && data.customers.length > 0) {
        setSuggestedCustomers(data.customers);
        setDropdownVisible(true);
        setActiveIndex(-1);
      } else {
        setSuggestedCustomers([]);
        setDropdownVisible(false);
        setCustomerDetails(null);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error.message);
    }
  };

  const handleSelectCustomer = (customer) => {
    setInputValue(customer[type] || "");
    setCustomerDetails(customer);
    setDropdownVisible(false);
    setActiveIndex(-1);
  };

  const highlightQuery = (text, query) => {
    if (!query || !text) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-500/50 text-black font-[500]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleKeyDown = (e) => {
    if (!isDropdownVisible || suggestedCustomers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex + 1) % suggestedCustomers.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prevIndex) => (prevIndex - 1 + suggestedCustomers.length) % suggestedCustomers.length
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectCustomer(suggestedCustomers[activeIndex]);
    }
  };

  const handleBlur = (e) => {
    // Check if blur is happening because of click inside dropdown
    if (!e.relatedTarget || !dropdownRef.current?.contains(e.relatedTarget)) {
      setTimeout(() => setDropdownVisible(false), 200);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type={type === "phone" ? "number" : "text"}
        placeholder={`Search by ${type === "phone" ? "Phone" : "Name"}`}
        value={inputValue}
        onChange={fetchCustomerByName}
        onFocus={() => setDropdownVisible(suggestedCustomers.length > 0)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="outline-none border border-[var(--color-accent)] rounded-lg p-2 z-10 bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer w-full"
      />

      {isDropdownVisible && (
        <ul
          ref={dropdownRef}
          className="absolute top-full left-0 w-full bg-[var(--color-card)] border border-neutral-500/40 rounded-lg shadow-md z-50 max-h-48 overflow-y-auto"
        >
          {suggestedCustomers.map((customer, index) => (
            <li
              key={customer._id}
              className={`p-2 cursor-pointer ${
                index === activeIndex ? "bg-neutral-500/10" : "hover:bg-neutral-500/20"
              }`}
              onClick={() => handleSelectCustomer(customer)}
              tabIndex="0"
              onMouseEnter={() => setActiveIndex(index)}
            >
              {highlightQuery(customer[type], inputValue)}
            </li>
          ))}
          {suggestedCustomers.length === 0 && (
            <li className="p-2 text-[var(--color-text-light)]">No customers found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomerSuggestion;
