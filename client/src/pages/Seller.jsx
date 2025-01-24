import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import SellerTopRibbon from "../components/seller/shared/SellerTopRibbon";
import Footer from "../components/shared/Footer";

const Seller = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    } else if (user.role !== "employee") {
      navigate("/");
    }
  }, []);

  return (
    <div ref={pageRef} className="w-full h-screen flex flex-col overflow-hidden items-center justify-center bg-[var(--color-sidebar)] text-[var(--color-text)]">
        <SellerTopRibbon pageRef={pageRef}/>
        <div className="p-2 flex-1 w-full overflow-x-auto overflow-y-auto">
          <Outlet />
        </div>
        <Footer />
    </div>
  );
};

export default Seller;
