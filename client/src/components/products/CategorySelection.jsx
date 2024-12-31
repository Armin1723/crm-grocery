import React from "react";
import { categories } from "../utils";

const CategorySelection = ({ category, setCategory }) => {
  return (
    <div className="my-2">
      <select
        name="category"
        className={`w-fit max-w-[200px] border border-neutral-500/50 text-[var(--color-text-light)] rounded-md bg-transparent outline-none p-2 px-3 cursor-pointer`}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" className="!bg-[var(--color-card)]">
          {"Choose a category"}
        </option>
        {categories.map((cat) => (
          <option
            key={cat.category}
            value={cat.category}
            className="!bg-[var(--color-card)]"
          >
            {cat.category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelection;
