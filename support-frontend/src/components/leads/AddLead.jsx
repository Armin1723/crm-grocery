import React from "react";
import LeadForm from "./LeadForm";

const AddLead = () => {
  return (
    <div className="flex flex-col gap-2 rounded-lg p-3 border border-neutral-500/50 h-full bg-[var(--color-sidebar)] overflow-y-auto">
      <div className="flex items-center flex-wrap justify-between p-2">
        <h1 className="text-xl font-bold">Add Lead</h1>
      </div>
      <LeadForm />
    </div>
  );
};

export default AddLead;
