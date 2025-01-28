import React from "react";
import EmployeeForm from "./EmployeeForm";

const AddEmployee = () => {

  return (
    <div className="p-3 flex-1 overflow-y-auto w-full rounded-md flex flex-col gap-2 border border-neutral-500/50 bg-[var(--color-sidebar)]">
      <div className="title flex items-center gap-2 my-2">
        <p className="text-xl max-lg:text-lg font-bold ">Add Employee</p>
      </div>
      <div className="form-wrapper w-full px-1 py-4 flex-1 overflow-y-auto">
        <EmployeeForm />
      </div>
    </div>
  );
};

export default AddEmployee;
