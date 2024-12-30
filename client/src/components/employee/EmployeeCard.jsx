import React from "react";
import Avatar from "../utils/Avatar";

const EmployeeCard = ({ employee }) => {
  return (
    <div className="p-6 w-full rounded-lg shadow-lg bg-[var(--color-card)] text-[var(--color-text)] mx-auto">
      {/* Card Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Left Section: Avatar and Name */}
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="rounded-full bg-[var(--color-sidebar)] overflow-hidden flex-shrink-0">
            {employee?.avatar ? (
              <Avatar image={employee.avatar} width={50} withBorder={false} />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-[var(--color-text-light)]">
                {employee?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name and Role */}
          <div>
            <div className="title flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {employee?.name || "Unknown"}
              </h2>
              <p
                className={`text-xs px-3 py-1 inline-block rounded-full capitalize text-white ${
                  employee?.role === "admin"
                    ? "bg-[var(--color-accent)]"
                    : "bg-[var(--color-accent-dark)] "
                }`}
              >
                {employee?.role || "Employee"}
              </p>
            </div>
            <p className="text-sm">{employee?.uuid}</p>
          </div>
        </div>

        {/* Right Section: Status */}
        <div className="text-sm sm:text-right flex flex-col gap-1 items-center">
          <p className="font-semibold text-[var(--color-text-light)]">
            Status
          </p>
          <p
            className={`font-semibold px-3 py-1 rounded capitalize ${
              employee?.status === "active"
                ? "text-green-600 bg-green-100"
                : "text-red-600 bg-red-100"
            }`}
          >
            {employee?.status || "Inactive"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-[var(--color-text-light)] opacity-20" />

      {/* Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Details */}
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

        {/* Right Details */}
        <div>
          <p>
            <span className="font-semibold text-[var(--color-text-light)]">
              Age:
            </span>{" "}
            {employee?.age || "N/A"}
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
