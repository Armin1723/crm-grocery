import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../utils/Avatar";
import { formatDateIntl } from "../utils";

const CompanyCard = ({ company, otherClasses = "", isAdmin = false }) => {
  const getSubscriptionStatus = () => {
    const now = new Date();
    const endDate = new Date(company?.subscriptionEndDate);
    return company.subscription && now > endDate ? "inactive" : "active";
  };

  return (
    <div
      className={`p-4 w-full rounded-lg flex flex-col justify-between
      bg-[var(--color-card)] text-[var(--color-text)] mx-auto
      ${
        getSubscriptionStatus() === "active"
          ? "bg-green-500/10"
          : "bg-red-500/10"
      }
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
                <Link
                  to={isAdmin ? "/company" : ""}
                  className="hover:underline"
                >
                  {company?.name || "Unknown"}
                </Link>
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
            <p className="text-xs italic text-[var(--color-text-light)]">{company?.licenseKey}</p>
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
              {`${company?.address?.split(" ").slice(0,4).join(" ")}...` || "N/A"}
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

export default CompanyCard;
