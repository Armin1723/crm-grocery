import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Register = ({}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
      avatar: null,
    },
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Handle avatar image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500000) {
        event.target.value = null;
        toast.error("Image size should be less than 500KB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setValue("avatar", file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const registerUser = async (values) => {
    setLoading(true);

    const id = toast.loading("Registering you in...");
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("dob", values.dob);
    formData.append("address", values.address);

    // Append avatar photo to FormData object
    if (values.avatar instanceof File) {
      formData.append("avatar", values.avatar);
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to register.");
      } else {
        toast.update(id, {
          render: "Registration successful",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        navigate("/auth/login");
        toast.info("Please check your email.");
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
    <div className="flex flex-col h-full overflow-y-auto items-center p-3 w-full">
      <motion.form
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(registerUser)}
        className="flex flex-col gap-4 p-3 rounded-md py-6 max-sm:w-3/4 max-w-[80%]"
      >
        <div className="intro my-4 max-sm:my-2">
          <h2 className="font-outfit font-bold text-xl sm:text-3xl md:text-3xl lg:text-3xl ">
            Welcome to Grocery - CRM
          </h2>
          <p className="text-sm text-[var(--color-text-light)]">
            Enter your details to get started.
          </p>
        </div>

        {/* Avatar-Name Upload */}
        <div className="flex w-full name-image-group items-center justify-between gap-4">
          <div className="image-input rounded-lg py-2 text-center relative">
            {avatarPreview ? (
              <div className="relative w-fit px-3 flex items-center justify-center">
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="h-16 aspect-square rounded-full object-cover border shadow-lg"
                />
                <div
                  className="absolute top-2 right-0 cursor-pointer hover:opacity-75"
                  onClick={() => {
                    setAvatarPreview(null);
                    setValue("avatar", null);
                  }}
                >
                  <MdClose />
                </div>
              </div>
            ) : (
              <img
                src="https://api.dicebear.com/7.x/avataaars/png?seed=JohnDoe"
                loading="lazy"
                alt="Upload"
                onClick={() => document.getElementById("avatar-upload").click()}
                className="h-16 aspect-square rounded-full flex items-center justify-center bg-[var(--color-card)] cursor-pointer border shadow-lg"
              ></img>
            )}
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden py-2"
              onChange={handleImageChange}
            />
          </div>

          <div className="name-input flex-1 relative group">
            <input
              type="text"
              placeholder=" "
              aria-invalid={errors?.name ? "true" : "false"}
              className={`outline-none peer border-b border-[var(--color-accent)] w-full !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] ${
                errors?.name && "!border-red-500 focus:!border-red-500"
              } transition-all duration-300`}
              {...register("name", {
                required: "Name is required",
              })}
            />
            <label
              htmlFor="name"
              className="absolute appearance-none z-[5] text-[var(--color-text-light)] transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
            >
              Name*
            </label>
            {errors?.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.name?.message}
              </p>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="w-full flex flex-col relative group my-2">
          <input
            type="email"
            placeholder=" "
            className={`outline-none peer border-b border-[var(--color-accent)] z-[10] bg-transparent focus:border-[var(--color-accent-dark)] ${
              errors?.email && "!border-red-500 focus:!border-red-500"
            } transition-all duration-300`}
            {...register("email", {
              required: "Email is required",
            })}
          />
          <label
            htmlFor="email"
            className="absolute appearance-none z-[5] text-[var(--color-text-light)] transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
          >
            Email*{" "}
          </label>
          {errors?.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors?.email?.message}
            </p>
          )}
        </div>

        {/* Phone and DOB */}
        <div className="phone-dob-group flex max-sm:flex-col items-end gap-2 w-full ">
          <div className="w-1/2 max-sm:w-full relative group my-2">
            <input
              type="tel"
              placeholder=" "
              aria-invalid={errors?.phone ? "true" : "false"}
              className={`outline-none peer border-b border-[var(--color-accent)] w-full z-[10] bg-transparent focus:border-[var(--color-accent-dark)] ${
                errors?.phone && "!border-red-500 focus:!border-red-500"
              } transition-all duration-300`}
              {...register("phone", {
                required: "Phone is required",
                validate: (value) =>
                  value.length === 10 || "Phone number should be 10 digits",
              })}
            />
            <label
              htmlFor="phone"
              className="absolute appearance-none z-[5] text-[var(--color-text-light)] transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
            >
              Phone*{" "}
            </label>
            {errors?.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.phone?.message}
              </p>
            )}
          </div>

          <div className="w-1/2 max-sm:w-full relative group my-2">
            <label for="dob" className="text-[var(--color-text-light)] text-xs">
              Date of Birth*
            </label>
            <input
              type="date"
              placeholder=" "   
              title="Date of Birth"
              aria-invalid={errors?.dob ? "true" : "false"}
              className={`outline-none peer border-b border-[var(--color-accent)] w-full z-[10] bg-transparent focus:border-[var(--color-accent-dark)] ${
                errors?.dob && "!border-red-500 focus:!border-red-500"
              } transition-all duration-300`}
              {...register("dob", {
                required: "Date of Birth is required",
              })}
            />
            {errors?.dob && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.dob?.message}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="w-full relative group my-2">
          <textarea
            placeholder=" "
            rows={1}
            aria-invalid={errors?.address ? "true" : "false"}
            className={`outline-none peer border-b border-[var(--color-accent)] w-full z-[10] bg-transparent focus:border-[var(--color-accent-dark)] ${
              errors?.address && "!border-red-500 focus:!border-red-500"
            } transition-all duration-300`}
            {...register("address")}
          />
          <label
            htmlFor="address"
            className="absolute appearance-none z-[5] text-[var(--color-text-light)] transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
          >
            Address*{" "}
          </label>
        </div>

        {/* Link to login page */}
        <Link
          className="text-left text-xs text-accent hover:text-accentDark hover:underline"
          to="/auth/login"
        >
          Already Registered?
        </Link>

        <button
          type="submit"
          disabled={Object.keys(errors).length > 0 || loading}
          className="px-3 py-1.5 my-2 capitalize rounded-md bg-accent hover:bg-accentDark text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Register
        </button>
      </motion.form>
    </div>
  );
};

export default Register;
