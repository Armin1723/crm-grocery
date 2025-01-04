import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import BreadCrumbNav from "../components/utils/BreadCrumbNav";
import TopRibbon from "../components/shared/TopRibbon";
import Footer from "../components/shared/Footer";
import useAuthStatus from "../hooks/useAuthStatus";

const Home = () => {

  const pageRef = useRef(null);

  useAuthStatus();

  return (
    <div ref={pageRef} className="flex h-screen w-full bg-[var(--color-primary)] text-[var(--color-text)] ">
      <Sidebar />
      <div className="content flex flex-1 h-screen overflow-y-auto flex-col items-start bg-[var(--color-primary)] ">
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
