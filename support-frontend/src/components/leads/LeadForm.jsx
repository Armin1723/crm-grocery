import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Divider from "../utils/Divider";
import { parseDate } from "../utils";

const LeadForm = ({
  lead = {},
  title = "add",
  setRefetch = () => {},
  closeModal = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: lead.name || "",
      phone: lead.phone || "",
      email: lead.email || "",
      dob: parseDate(lead.dob) || "",
      description: lead.description || "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/leads${
          title === "add" ? "" : `/${lead._id}`
        }`,
        {
          method: title === "add" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast.success(
        `Lead ${title === "add" ? "added" : "updated"} successfully`
      );
      if (title === "edit") {
        closeModal();
      } else {
        reset();
      }
      setRefetch((p) => !p);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-end gap-4 h-full min-h-fit overflow-y-auto select-none p-3"
    >
      <Divider title="Lead Details" />

      <div className="w-full flex max-md:flex-col items-center gap-4 flex-">
        {/* Name Field */}
        <div className="w-full flex flex-col relative group my-2">
          <input
            type="text"
            placeholder=" "
            className={`input peer ${
              errors.name && "border-red-500 focus:!border-red-500"
            }`}
            {...register("name", { required: "Name is required" })}
          />
          <label
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors.name && "!text-red-500"
            }`}
          >
            Name*
          </label>
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Phone Field */}
        <div className="w-full flex flex-col relative group my-2">
          <input
            type="text"
            placeholder=" "
            className={`input peer ${
              errors.phone && "border-red-500 focus:!border-red-500"
            }`}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Phone number must be 10 digits",
              },
            })}
          />
          <label
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors.phone && "!text-red-500"
            }`}
          >
            Phone*
          </label>
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>
      </div>

      <div className="w-full flex max-md:flex-col items-center gap-4 flex-">
        {/* Email Field */}
        <div className="w-full flex flex-col relative group my-2">
          <input
            type="email"
            placeholder=" "
            className={`input peer ${
              errors.email && "border-red-500 focus:!border.-red-500"
            }`}
            {...register("email")}
          />
          <label
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors.email && "!text-red-500"
            }`}
          >
            Email
          </label>
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Date of Birth Field */}
        <div className="w-full flex flex-col relative group my-2">
          <input type="date" className="input peer" {...register("dob")} />
          <label className="input-label peer-focus:text-[var(--color-accent-dark)]">
            Date of Birth
          </label>
        </div>
      </div>

      {/* Description Field */}
      <div className="w-full flex flex-col relative group my-2 text-sm">
        <textarea
          rows={5}
          placehlder="Enter Description"
          className="input peer"
          {...register("description")}
        />
        <label className="input-label peer-focus:text-[var(--color-accent-dark)]">
          Description
        </label>
      </div>

      {/* Submit Button */}
      <button
        disabled={Object.keys(errors).length > 0 || loading}
        className="w-full capitalize py-2 rounded-md bg-accent hover:bg-accentDark text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-none transition-all duration-300"
      >
        {title} Lead
      </button>
    </form>
  );
};

export default LeadForm;
