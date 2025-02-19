import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import SellerTopRibbon from "../components/seller/shared/SellerTopRibbon";
import Footer from "../components/shared/Footer";
import useAuthStatus from "../hooks/useAuthStatus";

const Seller = () => {
  const pageRef = useRef(null);

  useAuthStatus();

  return (
    <div ref={pageRef} className="w-full flex-1 flex flex-col overflow-hidden items-center justify-center bg-[var(--color-sidebar)] text-[var(--color-text)]">
        <SellerTopRibbon pageRef={pageRef}/>
        <div className="p-2 flex-1 w-full overflow-x-auto ">
          <Outlet />
        </div>
        <Footer />
    </div>
  );
};

export default Seller;
