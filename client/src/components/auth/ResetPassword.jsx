import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const ResetPassword = () => {
  const [passVisible, setPassVisible] = React.useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    criteriaMode: "all",
    shouldFocusError: true,
  });

  const updatePassword = async (values) => {
    const id = toast.loading("Updating your password...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: values.password,
            resetPasswordToken: token,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Password reset failed");
        throw new Error(data.message || "Password reset failed");
      } else {
        toast.update(id, {
          render: "Password reset successfully. Login to continue",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/auth");
      }
    } catch (error) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(updatePassword)}
      className="flex flex-col gap-4 p-3 rounded-md bg-[var(--color-sidebar)] py-6 max-sm:w-3/4 lg:max-w-[80%] md:w-2/3"
    >
      <div className="intro my-6 max-lg:my-4 max-sm:my-2">
        <h2 className="font-outfit font-bold text-xl sm:text-3xl md:text-3xl lg:text-3xl ">
          Reset your password.
        </h2>
        <p className="text-sm text-neutral-500">Choose new password.</p>
      </div>

      <div className="password-input flex flex-col relative group my-2">
        <input
          type={passVisible ? "text" : "password"}
          name="password"
          placeholder=" "
          className="outline-none peer border-b border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must have 8 characters , an uppercase character, a number, and a special character",
            },
          })}
        />
        <label
          htmlFor="password"
          className="absolute appearance-none text-neutral-500 transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
        >
          New Password
        </label>
        <div
          className="absolute right-2 cursor-pointer z-[20]"
          onClick={() => setPassVisible((prev) => !prev)}
        >
          {passVisible ? <FaEyeSlash /> : <FaEye />}
        </div>
        {errors && errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="confirm-password-input flex flex-col relative group my-2">
        <input
          type="password"
          name="confirmPassword"
          placeholder=" "
          className="outline-none peer border-b border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300"
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />
        <label
          htmlFor="confirmPassword"
          className="absolute appearance-none text-neutral-500 transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
        >
          Confirm Password
        </label>
        {errors && errors.confirmPassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <Link
        to="/auth"
        className="back-button text-neutral-500 hover:text-neutral-700 transition-all duration-300 ease-in text-sm text-left flex items-center gap-1"
      >
        <FaArrowLeft />
        <p>Back to Login</p>
      </Link>

      <button
        type="submit"
        disabled={errors.password || errors.confirmPassword}
        className="rounded-md bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-[#f6f7f5] px-3 py-1.5 my-2 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-accent)] transition-all duration-300 flex items-center justify-center gap-2 "
      >
        <p>Update Password.</p>
        <FaEdit />
      </button>
    </motion.form>
  );
};

export default ResetPassword;
