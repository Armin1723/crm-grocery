import React from "react";
import { TiArrowSortedUp } from "react-icons/ti";

const SortableLink = ({
  title,
  sort,
  sortType,
  setSort = () => {},
  setSortType = () => {},
}) => {
  return (
    <div
      onClick={() => setSort(title)}
      className={`sortable cursor-pointer  flex items-center gap-2 ${
        sort === title && "bg-accent/10"
      } px-2 py-1 rounded-md`}
    >
      <p className="capitalize">{title}</p>
      {sort === title && (
        <TiArrowSortedUp
          onClick={() =>
            setSortType((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className={`${
            sortType === "desc" ? "rotate-180" : ""
          } transition-all duration-300 ease-in hover:text-accent`}
        />
      )}
    </div>
  );
};

export default SortableLink;
