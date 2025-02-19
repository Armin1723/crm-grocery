import React, { useState } from "react";
import { useSelector } from "react-redux";
import CompanyCard from "./CompanyCard";
import Divider from "../utils/Divider";
import { MdEdit } from "react-icons/md";
import ViewEmployees from "../employee/ViewEmployees";
import Modal from "../utils/Modal";
import CompanyForm from "./CompanyForm";

const ViewCompany = () => {
  const user = useSelector((state) => state.user);
  const isAdmin = user && user?.role == "admin";

  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-2">
      <Divider
        title={
          <div className="flex items-center gap-2">
            <p>Company Details</p>
            {isAdmin && (
              <MdEdit
                title="Edit Company"
                className="cursor-pointer"
                onClick={() => setEditModalOpen(true)}
              />
            )}
          </div>
        }
      />
      <CompanyCard
        companyId={user?.company?._id}
        isAdmin={user && user?.role == "admin"}
      />

      <Divider title="Employee Details" />
      {isAdmin && <ViewEmployees />}

      {editModalOpen && (
        <Modal
          title="Edit Company"
          onClose={() => setEditModalOpen(false)}
          isOpen={editModalOpen}
        >
          <CompanyForm
            company={user.company}
            title="edit"
            closeModal={() => setEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ViewCompany;
