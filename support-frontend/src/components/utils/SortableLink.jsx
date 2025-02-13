import React from "react";
import { TiArrowSortedUp } from "react-icons/ti";

const SortableLink = ({
  title,
  sortType,
  setSort = () => {},
  setSortType = () => {},
  isActive,
}) => {
  return (
    <div
      onClick={() => setSort(title)}
      className={`sortable cursor-pointer w-fit flex items-center gap-2 ${
        isActive && "bg-accent/10"
      } px-2 py-1 rounded-md`}
    >
      <div className="capitalize">{title}</div>
      {isActive && (
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
