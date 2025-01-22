import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import TopRibbon from "../components/shared/TopRibbon";
import SellerSidebar from "../components/seller/shared/SellerSidebar";

const Seller = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    } else if (user.role !== "employee") {
      navigate("/");
    }
  }, []);

  return (
    <div className="w-full min-h-dvh flex items-center justify-center text-[var(--color-text)]">
      <SellerSidebar />
      <div className="flex flex-col flex-1 w-full h-screen overflow-y-auto bg-[var(--color-primary)]">
        <TopRibbon />
        <div className="p-2 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Seller;
