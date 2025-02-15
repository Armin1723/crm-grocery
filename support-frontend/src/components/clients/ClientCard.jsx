import React from "react";
import Avatar from "../utils/Avatar";
import { formatDateIntl, getAge } from "../utils";
import Divider from "../utils/Divider";

const CompanyCard = ({ company, otherClasses = "", isAdmin = true }) => {
  const getSubscriptionStatus = () => {
    const now = new Date();
    const endDate = new Date(company?.subscriptionEndDate);
    return company.subscription && now > endDate ? "inactive" : "active";
  };

  return (
    <div
      className={`p-4 w-full rounded-lg flex flex-col justify-between
        text-[var(--color-text)] mx-auto
        ${otherClasses}`}
    >
      {/* Card Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-[var(--color-sidebar)] overflow-hidden flex-shrink-0">
            <Avatar
              image={company?.logo}
              width={50}
              withBorder={false}
              fallback={company?.initials}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="title flex items-center gap-2">
              <h2 className="text-xl font-semibold capitalize">
                {company?.name || "Unknown"}
              </h2>
              <p
                className={`text-xs px-3 py-0.5 inline-block rounded-full capitalize text-white
                  ${
                    company?.subscription
                      ? "bg-[var(--color-accent-dark)]"
                      : "bg-gray-500"
                  }`}
              >
                {company?.subscription || "No Plan"}
              </p>
            </div>
            <p className="text-xs">Branch: {company?.branch}</p>
          </div>
        </div>

        <div className="text-sm sm:text-right flex flex-row sm:flex-col gap-2 items-center">
          <p className="font-semibold text-[var(--color-text-light)]">
            Subscription
          </p>
          <p
            className={`font-semibold px-3 text-xs capitalize border rounded-lg ${
              getSubscriptionStatus() === "active"
                ? "text-green-600 border-green-400 bg-green-100"
                : "text-red-600 border-red-400 bg-red-100"
            }`}
          >
            {getSubscriptionStatus()}
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-[var(--color-text-light)] opacity-20" />

      <div className="grid text-sm grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p>
            <span className="font-semibold text-[var(--color-text-light)]">
              Email:
            </span>{" "}
            {company?.email || "Not provided"}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-[var(--color-text-light)]">
              Phone:
            </span>{" "}
            {company?.phone || "Not provided"}
          </p>
        </div>

        <div>
          <p>
            <span className="font-semibold text-[var(--color-text-light)]">
              GSTIN:
            </span>{" "}
            {company?.gstin || "N/A"}
          </p>
          <p className="mt-2 flex items-center gap-2" title={company?.address}>
            <span className="font-semibold text-[var(--color-text-light)]">
              Address:
            </span>{" "}
            <span className="truncate text-ellipsis text-wrap">
              {`${company?.address?.split(" ").slice(0, 4).join(" ")}...` ||
                "N/A"}
            </span>
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-4 text-sm text-[var(--color-text-light)]">
          <p>
            Subscription Period:{" "}
            {formatDateIntl(company?.subscriptionStartDate)} -{" "}
            {formatDateIntl(company?.subscriptionEndDate)}
          </p>
        </div>
      )}
    </div>
  );
};

const ClientCard = ({ client }) => {
  const isAdmin = client && client.role && client.role === "admin";
  return (
    <div
      className={` ${
        client?.role == "admin" ? "bg-red-500/10" : "bg-green-500/10"
      } p-6 w-full rounded-lg shadow-lg bg-[var(--color-card)] text-[var(--color-text)] mx-auto`}
    >
      {/* Card Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-[var(--color-sidebar)] overflow-hidden flex-shrink-0">
            <Avatar
              image={client?.avatar.replace(
                "/uploads/",
                "/uploads/w_100,h_100,c_thumb"
              )}
              width={50}
              withBorder={false}
            />
          </div>

          <div>
            <div className="title flex items-center gap-2">
              <h2 className="text-xl font-semibold capitalize">
                {client?.name || "Unknown"}
              </h2>
              <p
                className={`text-xs px-3 py-1 inline-block rounded-full capitalize text-white ${
                  client?.role === "admin"
                    ? "bg-red-500"
                    : "bg-[var(--color-accent-dark)] "
                }`}
              >
                {client?.role || "Employee"}
              </p>
            </div>
            <p className="text-sm">{client?.uuid}</p>
            <p className="text-xs">DoB: {formatDateIntl(client?.dob)}</p>
          </div>
        </div>

        <div className="text-sm sm:text-right flex flex-row sm:flex-col gap-2 items-center">
          <p className="font-semibold text-[var(--color-text-light)]">Status</p>
          <p
            className={`font-semibold px-3 text-xs capitalize border rounded-lg ${
              client?.status === "active"
                ? "text-green-600 border-green-400 bg-green-100"
                : "text-red-600 border-red-400 bg-red-100"
            }`}
          >
            {client?.status || "Inactive"}
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
            {client?.email || "Not provided"}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-[var(--color-text-light)]">
              Phone:
            </span>{" "}
            {client?.phone || "Not provided"}
          </p>
        </div>

        <div>
          <p>
            <span className="font-semibold text-[var(--color-text-light)]">
              Age:
            </span>{" "}
            {getAge(client?.dob) || "N/A"}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-[var(--color-text-light)]">
              Address:
            </span>{" "}
            <span className="truncate text-ellipsis">
              {client?.address?.slice(0, 20) || "N/A"}
            </span>
          </p>
        </div>
      </div>

      {client.company && (
        <div className="mt-4">
          <Divider title="Company Details" />
          <CompanyCard company={client?.company} />
        </div>
      )}
    </div>
  );
};

export default ClientCard;
