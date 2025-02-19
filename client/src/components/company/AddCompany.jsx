import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CompanyForm from "./CompanyForm";
import { toast } from "react-toastify";
import ThemeToggle from "../utils/ThemeToggle";
import LogoutButton from "../utils/LogoutButton";

const Ribbon = () => {
  const user = useSelector((state) => state.user);
  return (
    <div className="w-full p-4 px-6 text-[var(--color-text)] text-center flex items-center justify-between border-b border-neutral-500/50">
      <div className="left">
        <h2 className="text-xl font-semibold">Welcome <span className="text-accent capitalize">{user.name}</span></h2>
      </div>
      <div className="right flex items-center justify-center gap-4">
        <ThemeToggle />
        <LogoutButton otherClasses='mt-0'/>
      </div>
    </div>
  );
};

const AddCompany = () => {
  const user = useSelector((state) => state.user);

  useEffect(() => {
    toast({
      message: "Please fill in the company details",
      type: "info",
    });
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <Ribbon />
      <div className="company-container flex-1 w-full p-3 rounded-lg bg-[var(--color-card)] overflow-y-auto">
        <CompanyForm title="add" />
      </div>
    </div>
  );
};

export default AddCompany;
