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
    if (user && user.avatar) {
      toast.info("You are already logged in");
      navigate("/");
    }
  }, []);

  return (
    <div className="w-full h-dvh flex items-center justify-between max-sm:flex-col-reverse bg-[var(--color-card)] text-[var(--color-text)]">
      <div className="form-container flex flex-col items-center justify-center w-1/2 max-sm:w-full max-sm:flex-1 ">
        <Outlet />
      </div>
      <div className="animation-container flex flex-col items-center justify-center bg-[var(--color-card)] h-full w-1/2 max-sm:w-full max-sm:h-1/3 md:border-l border-[var(--color-primary)]">
        <Suspense
          fallback={
            <div className="flex flex-col justify-center items-center w-screen h-screen bg-[var(--color-priamry)] ">
              <div className="spinner"></div>
            </div>
          }
        >
          <Lottie animationData={loginAnimation} className="w-1/2" />
        </Suspense>
      </div>
    </div>
  );
};

export default Auth;
