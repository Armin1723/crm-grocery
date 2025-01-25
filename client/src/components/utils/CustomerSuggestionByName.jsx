import React, { useState } from "react";

const CustomerSuggestionByName = ({ setCustomerDetails = () => {} }) => {
  const [suggestedCustomers, setSuggestedCustomers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fetchCustomerByName = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    setCustomerDetails(null);

    if (!value) {
      setSuggestedCustomers([]);
      setDropdownVisible(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/customers?name=${value}`,
        {
          credentials: "include",
        }
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
    setInputValue(customer.name);
    setCustomerDetails(customer);
    setDropdownVisible(false);
    setActiveIndex(-1); 
  };

  const highlightQuery = (name, query) => {
    if (!query) return name;
    const regex = new RegExp(`(${query})`, "i");
    const parts = name.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-[var(--color-accent-dark)] bg-yellow-500 font-semibold">
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
      setActiveIndex((prevIndex) => (prevIndex - 1 + suggestedCustomers.length) % suggestedCustomers.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectCustomer(suggestedCustomers[activeIndex]);
    }
  };

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Search by name"
        value={inputValue}
        onChange={fetchCustomerByName}
        onFocus={() => setDropdownVisible(suggestedCustomers.length > 0)}
        onBlur={() => setTimeout(() => setDropdownVisible(false), 200)} 
        onKeyDown={handleKeyDown}
        className="outline-none border border-[var(--color-accent)] rounded-lg p-2 !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer w-full"
      />

      {/* Dropdown Suggestions */}
      {isDropdownVisible && (
        <ul className="absolute w-full bg-[var(--color-card)] border border-neutral-500/40 rounded-b-lg shadow-md z-20">
          {suggestedCustomers.map((customer, index) => (
            <li
              key={customer._id}
              className={`p-2 cursor-pointer hover:bg-[var(--color-accent-light)] ${
                index === activeIndex ? "bg-accent/20" : ""
              }`}
              onClick={() => handleSelectCustomer(customer)}
            >
              {highlightQuery(customer.name, inputValue)}
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

export default CustomerSuggestionByName;
