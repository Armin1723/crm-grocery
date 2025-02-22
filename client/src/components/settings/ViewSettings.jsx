import React, { useState } from "react";
import EmployeeCard from "../employee/EmployeeCard";
import { useSelector } from "react-redux";
import Divider from "../utils/Divider";
import { MdEdit } from "react-icons/md";
import Modal from "../utils/Modal";
import EmployeeForm from "../employee/EmployeeForm";
import SecuritySettings from "../employee/SecuritySettings";

const ViewSettings = () => {
  const user = useSelector((state) => state.user);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 w-full bg-[var(--color-card)] flex-1 h-full p-3 rounded-md">
      <Divider
        title={
          <div className="flex items-center gap-2">
            <p>Personal Details</p>
            <MdEdit
              onClick={() => setEditModalOpen(true)}
              className="cursor-pointer"
            />
          </div>
        }
      />
      <EmployeeCard employee={user} />

      <SecuritySettings />

      {/* {user.role === "admin" && (
        <>
          <Divider
            title={
              <div className="flex items-center gap-2">
                <p>Company Details</p>
                <MdEdit
                  onClick={() => setEditCompanyModalOpen(true)}
                  className="cursor-pointer"
                />
              </div>
            }
          />
          <CompanyCard companyId={user?.company} />
        </>
      )} */}

      {editModalOpen && (
        <Modal
          isOpen={editModalOpen}
          title={"Edit Profile"}
          onClose={() => setEditModalOpen(false)}
        >
          <EmployeeForm
            employee={user}
            closeModal={() => setEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ViewSettings;
