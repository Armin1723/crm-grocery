import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/shared/Sidebar";
import BreadCrumbNav from "../components/utils/BreadCrumbNav";
import TopRibbon from "../components/shared/TopRibbon";
import Footer from "../components/shared/Footer";

const Home = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const pageRef = useRef(null);

  useEffect(() => {
    if (!user || !user.avatar) {
      toast.error("You are not logged in.");
      navigate("/auth/login");
    }
  }, []);

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
