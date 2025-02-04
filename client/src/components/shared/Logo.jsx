import React from "react";
import Avatar from "../utils/Avatar";
import { useSelector } from "react-redux";
import HoverCard from "./HoverCard";
import CompanyCard from "../company/CompanyCard";

const Logo = ({ expanded = "true" }) => {
  const user = useSelector((state) => state.user);
  return (
    <HoverCard
      title={
        <div className="flex items-center gap-2 overflow-hidden">
          <Avatar
            image={user?.company?.logo?.replace("/uploads/", "/uploads/w_80/")}
            width={40}
            withBorder={false}
          />
          <p
            className={`text-lg font-bold transition-all duration-300 ease-in overflow-hidden ${
              expanded ? "w-full" : "w-0"
            }`}
          >
            {user?.company?.name}
          </p>
        </div>
      }
      to={user.role == "admin" ? "/company" : "/seller/company"}
      className="logo flex items-center justify-between gap-2 overflow-hidden"
    >
      <CompanyCard
        company={user.company}
        isAdmin={user && user?.role == "admin"}
      />
    </HoverCard>
  );
};

export default Logo;
