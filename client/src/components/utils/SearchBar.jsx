import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const SearchBar = ({ query = "", setQuery = () => {} }) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(debouncedQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedQuery, setQuery]);

  return (
    <div className="flex items-center gap-1 border-b h-fit py-1 border-neutral-500/50 relative">
      <FaSearch className="text-neutral-500 flex " />
      <input
        type="text"
        placeholder="Search"
        value={debouncedQuery}
        onChange={(e) => setDebouncedQuery(e.target.value)}
        className="bg-transparent outline-none p-1 "
      />

      {debouncedQuery && (
        <p
          className="text-neutral-500 hover:text-neutral-800 transition-all cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => setDebouncedQuery("")}
        >
          <RxCross2 />
        </p>
      )}
    </div>
  );
};

export default SearchBar;
