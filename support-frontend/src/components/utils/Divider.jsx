import React from "react";

const Divider = ({ title = "" }) => {
  return (
    <div className="basic details w-full flex items-center gap-2 py-2">
      <div className="font-semibold">{title}</div>
      <div className="border-b-2 border-dashed border-neutral-500/50 flex-1"/>
    </div>
  );
};

export default Divider;
