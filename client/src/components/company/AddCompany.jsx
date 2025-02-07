import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CompanyForm from "./CompanyForm";
import { toast } from "react-toastify";

const AddCompany = () => {
  const user = useSelector((state) => state.user);

  useEffect(() => {
    toast({
      message: "Please fill in the company details",
      type: "info",
    });
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="company-container w-full p-3 rounded-lg bg-[var(--color-card)] overflow-y-auto">
        <CompanyForm title="add" />
      </div>
    </div>
  );
};

export default AddCompany;
