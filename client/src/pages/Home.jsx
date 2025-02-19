import React, { useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import BreadCrumbNav from "../components/utils/BreadCrumbNav";
import TopRibbon from "../components/shared/TopRibbon";
import Footer from "../components/shared/Footer";
import useAuthStatus from "../hooks/useAuthStatus";
import { useSelector } from "react-redux";

const Home = () => {
  const pageRef = useRef(null);
  const user = useSelector((state) => state.user);

  useAuthStatus();

  if (user && user?.name && user?.role !== "admin") {
    return <Navigate to="/seller" />;
  }

  return (
    <div
      ref={pageRef}
      className="flex flex-1 overflow-y-hidden w-full bg-[var(--color-primary)] text-[var(--color-text)] "
    >
      <Sidebar />
      <div className="content flex flex-1 h-full overflow-y-auto flex-col items-start bg-[var(--color-primary)] ">
        <TopRibbon pageRef={pageRef} />
        <BreadCrumbNav />
        <div className="outlet-container flex flex-1 w-full overflow-y-scroll">
          <Outlet />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
