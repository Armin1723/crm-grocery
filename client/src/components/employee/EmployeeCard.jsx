import React from "react";
import Avatar from "../utils/Avatar";
import { Link } from "react-router-dom";
import { getAge } from "../utils";

const EmployeeCard = ({ employee }) => {
  return (
    <div
      className={` ${
        employee?.role == "admin" ? "bg-red-500/10" : "bg-blue-500/10"
      } p-6 w-full rounded-lg shadow-lg bg-[var(--color-card)] text-[var(--color-text)] mx-auto`}
    >
      {/* Card Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-[var(--color-sidebar)] overflow-hidden flex-shrink-0">
            <Avatar image={employee?.avatar} width={50} withBorder={false} />
          </div>

          <div>
            <div className="title flex items-center gap-2">
              <h2 className="text-xl font-semibold capitalize">
                <Link
                  to={`/employees/${employee?.uuid}`}
                  className="hover:underline"
                >
                  {employee?.name || "Unknown"}
                </Link>
              </h2>
              <p
                className={`text-xs px-3 py-1 inline-block rounded-full capitalize text-white ${
                  employee?.role === "admin"
                    ? "bg-red-500"
                    : "bg-[var(--color-accent-dark)] "
                }`}
              >
                {employee?.role || "Employee"}
              </p>
            </div>
            <p className="text-sm">{employee?.uuid}</p>
          </div>
        </div>

        <div className="text-sm sm:text-right flex flex-row sm:flex-col gap-2 items-center">
          <p className="font-semibold text-[var(--color-text-light)]">Status</p>
          <p
            className={`font-semibold px-3 text-xs capitalize border rounded-lg ${
              employee?.status === "active"
                ? "text-green-600 border-green-400 bg-green-100"
                : "text-red-600 border-red-400 bg-red-100"
            }`}
          >
            {employee?.status || "Inactive"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-[var(--color-text-light)] opacity-20" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p>
            <span className="font-semibold text-[var(--color-text-light)]">
              Email:
            </span>{" "}
            {employee?.email || "Not provided"}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-[var(--color-text-light)]">
              Phone:
            </span>{" "}
            {employee?.phone || "Not provided"}
          </p>
        </div>

        <div>
          <p>
            <span className="font-semibold text-[var(--color-text-light)]">
              Age:
            </span>{" "}
            {getAge(employee?.dob) || "N/A"}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-[var(--color-text-light)]">
              Address:
            </span>{" "}
            {employee?.address || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
