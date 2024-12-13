import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../assets/animations/login-animation.json";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleTheme } from "../redux/features/theme/themeSlice";

const Auth = () => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.value);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(user) {
      toast.info("You are already logged in");
      navigate("/");
    }
    if(theme === "dark") {
      dispatch(toggleTheme());
    }
  },[]);

  return (
    <div className="w-full h-dvh flex items-center justify-between max-sm:flex-col-reverse ">
      <div className="form-container flex flex-col items-center justify-center w-1/2 max-sm:w-full max-sm:flex-1 bg-[var(--color-card)]">
        <Outlet />
      </div>
      <div className="animation-container flex flex-col items-center justify-center bg-[var(--color-primary)] h-full w-1/2 max-sm:w-full max-sm:h-1/3">
        <Lottie animationData={loginAnimation} className="w-1/2"/>
      </div>
    </div>
  );
};

export default Auth;
