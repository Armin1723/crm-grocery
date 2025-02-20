import { motion } from "framer-motion";
import React, { useState } from "react";
import { IoLogIn } from "react-icons/io5";
import { toast } from "react-toastify";
import { setUser } from "../../redux/features/user/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const Otp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    otp: null,
  });

  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOtpChange = (element, index) => {
    setErrors({ otp: null });
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus on next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      clearErrors("otp");
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      e.target.previousSibling.focus();
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrors({ otp: { message: "OTP must be 6 digits" } });
      return;
    }
    const id = toast.loading("Verifying OTP...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: otpValue }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, message]) => {
            setErrors((prev) => ({ ...prev, [field]: { message } }));
          });
        }
        throw new Error(data.message || "OTP verification failed");
      } else {
        const data = await response.json();
        if (!data.user) {
          throw new Error(data.message || "OTP verification failed");
        }
        //invalidate all queries
        queryClient.invalidateQueries();
        dispatch(setUser(data.user));
        toast.update(id, {
          render: "Login Successful.",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        if (data.user.role === "admin") {
          navigate("/");
        } else if (data.user.role === "employee") {
          navigate("/seller");
        }
      }
    } catch (error) {
      toast.update(id, {
        render: error.message || "OTP verification failed",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleOtpVerification}
      className="flex flex-col gap-4 p-3 rounded-md py-6 w-3/4"
    >
      <div className="intro my-6 max-lg:my-4 max-sm:my-2">
        <h2 className="font-outfit font-bold text-xl sm:text-3xl md:text-3xl lg:text-3xl ">
          Enter OTP
        </h2>
        <p className="text-sm text-[var(--color-text-light)]">
          Sent to your registered email.
        </p>
      </div>

      <div className="otp-input flex flex-col gap-2">
        <p className="">Enter Your OTP</p>
        <div className="otp-input flex my-2 gap-2 md:gap-4">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength="1"
              className={`outline-none rounded-lg border ${
                errors.otp
                  ? "border-red-500 text-red-500"
                  : "border-[var(--color-accent)]"
              } bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 text-center aspect-square w-8 lg:w-10`}
              value={data}
              onChange={(e) => handleOtpChange(e.target, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
        {errors && errors.otp && (
          <span className="text-red-500 text-sm">{errors?.otp.message}</span>
        )}
      </div>

      <Link
        to="/auth/login"
        className="text-[var(--color-accent)] text-sm hover:text-accentDark hover:underline"
      >
        Back to Login
      </Link>

      <button
        type="submit"
        disabled={loading || errors.otp}
        className="rounded-md disabled:cursor-not-allowed disabled:opacity-50 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-[#f6f7f5] px-3 py-1.5 my-2 transition-all duration-300 flex items-center justify-center gap-1"
      >
        <p>Login</p>
        <IoLogIn />
      </button>
    </motion.form>
  );
};

export default Otp;
