import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Divider from "../utils/Divider";
import EmployeeCard from "./EmployeeCard";
import EmployeeSales from "./EmployeeSales";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);

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
