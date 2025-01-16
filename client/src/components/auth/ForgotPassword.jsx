import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [error, setError] = React.useState(null);
  const [email, setEmail] = React.useState("");

  const handlePasswordReset = async(e) => {
    e.preventDefault();
    const id = toast.loading("Sending password reset email...");
    try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    if(!response.ok) {
      const data = await response.json();
      setError(data.message || "Password reset failed");
      throw new Error(data.message || "Password reset failed");
    }else{
      toast.update(id, {
        render: "Password reset email sent successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })
    }
  }catch(error){
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
      onSubmit={handlePasswordReset}
      className="flex flex-col gap-4 p-3 rounded-md py-6 max-sm:w-3/4 max-w-[80%]"
    >
      <div className="intro my-6 max-lg:my-4 max-sm:my-2">
        <h2 className="font-outfit font-bold text-xl sm:text-3xl md:text-3xl lg:text-3xl ">
          Forgot your password?
        </h2>
        <p className="text-sm text-neutral-500">
          Enter your email to reset password.
        </p>
      </div>

      <div className="email-input flex flex-col relative group my-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=" "
          className="outline-none peer border-b border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300"
        />
        <label
          htmlFor="email"
          className="absolute appearance-none text-neutral-500 transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
        >
          Email
        </label>
        {error && (
          <span className="text-red-500 text-sm">{error}</span>
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
        disabled={email === ""}
        className="rounded-md bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-[#f6f7f5] px-3 py-1.5 my-2 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-accent)] transition-all duration-300 flex items-center justify-center gap-2 "
      >
        <p>Send Email</p>
        <AiOutlineSend />
      </button>
    </motion.form>
  );
};

export default ForgotPassword;
