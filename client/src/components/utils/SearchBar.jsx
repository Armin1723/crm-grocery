import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const SearchBar = ({ query = "", setQuery = () => {} }) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    setDebouncedQuery(query);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(debouncedQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedQuery, setQuery]);

  return (
    <div className="max-sm:text-xs text-sm w-fit flex items-center border h-fit p-2 md:mx-2 gap-2 rounded-md border-neutral-500/50 relative">
      <FaSearch className="text-neutral-500 flex " />
      <input
        type="text"
        placeholder="Search"
        value={debouncedQuery}
        onChange={(e) => setDebouncedQuery(e.target.value)}
        className="bg-transparent outline-none "
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
