import React from "react";

const TagInput = ({ tags = [], setTags = () => {} }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      setTags([...tags, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-accent">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 px-3 py-1 bg-[#5D3FD3] text-white text-sm hover:opacity-85 transition-all duration-200 rounded-full"
        >
          <span>{tag}</span>
          <button className="text-sm" onClick={() => removeTag(index)}>
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        placeholder="Type and press Enter to add tags"
        className="flex-grow placeholder:text-neutral-500 border-none bg-transparent focus:outline-none"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TagInput;
