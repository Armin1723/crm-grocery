import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Divider from "../utils/Divider";
import EmployeeCard from "./EmployeeCard";
import EmployeeSales from "./EmployeeSales";
import { useSelector } from "react-redux";
import { MdChevronRight, MdFilePresent, MdImage } from "react-icons/md";
import { FaChevronCircleDown } from "react-icons/fa";

const EmployeeDetails = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const isAdmin = user && user.role && user.role === "admin";
  const isSelf = user && (user.uuid == id);
  const [employee, setEmployee] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showId, setShowId] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/employees/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setEmployee(data.employee);
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, refetch]);

  return (
    <div className="p-3 rounded-md flex h-full min-h-[70vh] flex-col gap-4 border border-neutral-500/50 bg-[var(--color-sidebar)] overflow-y-auto flex-1">
      {employee && !loading ? (
        <div className="wrapper flex flex-col overflow-y-auto gap-3">
          <Divider title="Employee Details" />
          <EmployeeCard employee={employee} setRefetch={setRefetch} />

          {(isAdmin || isSelf) && employee?.identityProof && (
            <>
              <Divider title={<div className="flex items-center gap-3">
                <span>Identity Proof</span>
                <button
                  onClick={() => setShowId((prev) => !prev)}
                  className={`font-semibold cursor-pointer transition-all duration-200 ${showId && 'rotate-180'}`}
                >
                  <FaChevronCircleDown/>
                </button>
              </div>} />
              <div className={`${showId ? 'max-h-full' : 'max-h-0'} transition-all duration-300 w-full mx-auto overflow-hidden rounded-lg shadow-md bg-[var(--color-card)]`}>
                <div className="p-1">
                  <div className="relative w-full flex justify-center">
                    {employee?.identityProof.endsWith(".pdf") ? (
                      <embed
                        type="application/pdf"
                        src={`${employee?.identityProof}#toolbar=0&navpanes=0`}
                        className="w-full md:w-4/5 h-[500px] border-none rounded-lg"
                        title="Identity Proof"
                      />
                    ) : (
                      <img
                        src={employee?.identityProof || "/placeholder.svg"}
                        alt="Identity Proof"
                        className="w-full h-[500px] aspect-video object-contain rounded-lg"
                      />
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    Identity Proof
                  </span>
                  {employee?.identityProof.endsWith(".pdf") ? (
                    <MdFilePresent className="w-5 h-5 text-[var(--color-text-light)]" />
                  ) : (
                    <MdImage className="w-5 h-5 text-[var(--color-text-light)]" />
                  )}
                </div>
              </div>
            </>
          )}

          <Divider title="Sales History" />
          <EmployeeSales uuid={id} />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
