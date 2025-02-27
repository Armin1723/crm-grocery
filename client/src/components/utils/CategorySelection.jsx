import React from "react";

const CategorySelection = ({ category = '', setCategory = ()=>{}, categories = []}) => {
  return (
    <div className="my-1">
      <select
        name="category"
        className={`max-sm:text-xs text-sm w-fit max-w-[200px] border border-neutral-500/50 text-[var(--color-text-light)] rounded-md bg-transparent outline-none p-2 cursor-pointer`}
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
          <option
            value="purchase"
            className="!bg-[var(--color-card)]"
          >
            Purchase
          </option>
      </select>
    </div>
  );
};

export default CategorySelection;
