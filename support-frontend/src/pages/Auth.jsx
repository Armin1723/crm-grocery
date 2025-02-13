import React, { useEffect, lazy, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Lottie = lazy(() => import("lottie-react"));
import loginAnimation from "../assets/animations/login-animation.json";

const Auth = () => {
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "employee") {
      navigate("/seller");
    } else if (user && user.name) {
      toast.info("You are already logged in");
      navigate("/");
    }
  }, []);

  return (
    <div className="w-full flex-1 flex items-center justify-between max-sm:flex-col-reverse bg-[var(--color-primary)] text-[var(--color-text)]">
      <div className="form-container flex flex-col items-center justify-center w-1/2 max-sm:w-full max-sm:flex-1 max-sm:min-h-[50vh]">
        <Outlet />
      </div>
      <div className="animation-container flex flex-col items-center justify-center bg-[var(--color-sidebar)] h-full w-1/2 max-sm:w-full max-sm:h-1/2 md:border-l border-[var(--color-primary)]">
        <Suspense
          fallback={
            <div className="flex flex-col justify-center items-center w-screen h-full ">
              <div className="spinner"></div>
            </div>
          }
        >
          <Lottie animationData={loginAnimation} className="w-1/3 lg:w-1/2" />
        </Suspense>
      </div>
    </div>
  );
};

export default Auth;
