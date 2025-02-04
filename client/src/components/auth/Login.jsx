import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/user/userSlice";
import { IoLogIn } from "react-icons/io5";

const Login = () => {
  const [passVisible, setPassVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    mode: "uncontrolled",
    defaultValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length > 8
          ? null
          : "Password should contain at least 8 characters",
    },
  });

  const handleLogin = async (values) => {
    setLoading(true);
    const id = toast.loading("Logging you in...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, message]) => {
            setError(field, { type: "manual", message });
          });
        }
        throw new Error(data.message || "Autorization failed");
      } else {
        const data = await response.json();
        dispatch(setUser(data.user));
        toast.update(id, {
          render: "Login successful",
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
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
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
      onSubmit={handleSubmit(handleLogin)}
      className="flex flex-col gap-4 p-3 rounded-md py-6 w-3/4"
    >
      <div className="intro my-6 max-lg:my-4 max-sm:my-2">
        <h2 className="font-outfit font-bold text-xl sm:text-3xl md:text-3xl lg:text-3xl ">
          Welcome Back
        </h2>
        <p className="text-sm text-[var(--color-text-light)]">
          Login to your account.
        </p>
      </div>

      <div className="email-input flex flex-col relative group my-2">
        <input
          type="text"
          name="email"
          placeholder=" "
          aria-invalid={errors.email ? "true" : "false"}
          className={`outline-none peer border-b border-[var(--color-accent)] z-[10] bg-transparent focus:border-[var(--color-accent-dark)] ${
            errors.email && "!border-red-500 focus:!border-red-500"
          } transition-all duration-300`}
          {...register("email", {
            required: "Email / Emp ID is required",
          })}
        />
        <label
          htmlFor="email"
          className="absolute appearance-none z-[5] text-[var(--color-text-light)] transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
        >
          Email / Emp ID
        </label>
        {errors && errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>
      <div className="pass-input flex flex-col relative group my-2">
        <input
          type={passVisible ? "text" : "password"}
          name="password"
          placeholder=" "
          autoComplete="off"
          aria-invalid={errors.password ? "true" : "false"}
          className={`outline-none peer border-b border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] ${
            errors.password && "!border-red-500 focus:!border-red-500"
          } transition-all duration-300`}
          {...register("password", {
            required: "Password is required",
          })}
        />
        <label
          htmlFor="password"
          className="absolute appearance-none text-[var(--color-text-light)] transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
        >
          Password
        </label>
        <div
          className="hide-icon absolute right-2 cursor-pointer z-[20] peer-focus:text-[var(--color-accent-dark)]"
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

      <div className="forgot-pass text-sm flex justify-between">
        <Link to="/auth/forgot-password" className="text-[var(--color-text-light)]">Forgot Password?</Link>
        <Link to="/auth/register" className="text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] hover:underline transition-all duration-300 ease-in">New here?</Link>
      </div>

      <button
        type="submit"
        disabled={loading || Object.keys(errors).length}
        className="rounded-md disabled:cursor-not-allowed disabled:opacity-50 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-[#f6f7f5] px-3 py-1.5 my-2 transition-all duration-300 flex items-center justify-center gap-1"
      >
        <p>Login</p>
        <IoLogIn />
      </button>
    </motion.form>
  );
};

export default Login;
