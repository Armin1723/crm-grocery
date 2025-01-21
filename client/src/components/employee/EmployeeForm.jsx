import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormInput from "../utils/FormInput";
import { MdClose } from "react-icons/md";
import Divider from "../utils/Divider";

const EmployeeForm = ({
  employee = {},
  title = "add",
  setRefetch = () => {},
  closeModal = () => {},
}) => {
  const [avatarPreview, setAvatarPreview] = React.useState(
    employee.avatar || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      avatar: employee.avatar || undefined,
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      dob: employee.dob || "",
      address: employee.address || "",
    },
  });

  // Handle avatar image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500000) {
        event.target.value = null;
        toast.error("Image size should be less than 500kb");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("avatar", file);
    }
  };

  const addEmployee = async (values) => {
    const id = toast.loading(
      `${title === "edit" ? "Updating" : "Adding"} employee...`
    );
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("dob", values.dob);
    formData.append("address", values.address);
    formData.append("uuid", employee.uuid);

    // Append avatar photo to FormData object
    if (values.avatar instanceof File) {
        formData.append("avatar", values.avatar);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/employees`,
        {
          method: title === "edit" ? "PUT" : "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.update(id, {
          render: data.message || `Failed to ${title} employee`,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(id, {
          render: `Employee ${
            title === "edit" ? "updated" : "added"
          } successfully`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        if (title === "add") {
          reset();
          setAvatarPreview(null);
        } else {
          closeModal();
          setRefetch((prev) => !prev);
        }
      }
    } catch (error) {
      toast.update(id, {
        render: error.message || `Failed to ${title} employee`,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(addEmployee)}
      className="flex flex-col justify-end gap-2 w-full flex-1 min-h-[60vh] px-3 max-sm:px-1 space-y-2"
    >
      {/* Avatar Upload */}
      <div className="space-y-2">
        <label htmlFor="avatar" className="my-2 font-semibold">
          Employee Image
        </label>
        <div className="border-2 border-dashed border-neutral-500/50 rounded-lg p-4 text-center relative">
          {avatarPreview ? (
            <div className="relative">
              <img
                src={avatarPreview}
                alt="Preview"
                className="mx-auto h-48 w-48 rounded-full object-cover"
              />
              <div
                className="absolute top-2 right-2 cursor-pointer hover:opacity-75"
                onClick={() => {
                  setAvatarPreview(null);
                  setValue("avatar", null);
                }}
              >
                <MdClose />
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-[var(--color-card)] rounded-lg">
              <span className="text-gray-500">Click to upload avatar</span>
            </div>
          )}
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            className="w-full py-2"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <Divider title="Personal Information" />

      <div className="name-email-group flex max-sm:flex-col gap-4 max-sm:gap-2 w-full">
        {/* Name Input */}
        <FormInput
          label="Name"
          error={errors && errors.name}
          otherClasses="w-1/2 max-sm:w-full"
          withAsterisk
        >
          <input
            type="text"
            placeholder="Full Name"
            className={`input peer ${
              errors && errors.name && "!border-red-500 focus:!border-red-500"
            }`}
            {...register("name", {
              required: "Name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Name should only contain letters and spaces",
              },
            })}
          />
        </FormInput>

        {/* Email Input */}
        <FormInput
          label="Email"
          error={errors && errors.email}
          otherClasses="w-1/2 max-sm:w-full"
          withAsterisk
        >
          <input
            type="email"
            placeholder="Email Address"
            className={`input peer ${
              errors && errors.email && "!border-red-500 focus:!border-red-500"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        </FormInput>
      </div>

      <div className="phone-age-group flex max-sm:flex-col gap-4 max-sm:gap-2 w-full">
        {/* Phone Input */}
        <FormInput
          label="Phone"
          error={errors && errors.phone}
          otherClasses="w-1/2 max-sm:w-full"
          withAsterisk
        >
          <input
            type="tel"
            placeholder="Phone Number"
            className={`input peer ${
              errors && errors.phone && "!border-red-500 focus:!border-red-500"
            }`}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number",
              },
            })}
          />
        </FormInput>

        {/* dob Input */}
        <FormInput
          label="Date of Birth"
          error={errors && errors.dob}
          otherClasses="w-1/2 max-sm:w-full"
          withAsterisk
        >
          <input
            type="date"
            placeholder="Date of Birth"
            className={`input peer ${
              errors && errors.dob && "!border-red-500 focus:!border-red-500"
            }`}
            {...register("dob", {
              required: "DoB is required",
            })}
          />
        </FormInput>
      </div>

      {/* Address Input */}
      <div className="address-input w-full flex flex-col relative group my-2">
        <label
          htmlFor="address"
          className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
            errors && errors.address && "!text-red-500"
          }`}
        >
          Address*
        </label>
        <textarea
          placeholder="Enter complete address"
          rows={3}
          className={`input peer ${
            errors && errors.address && "!border-red-500 focus:!border-red-500"
          }`}
          {...register("address", {
            required: "Address is required",
            minLength: {
              value: 10,
              message: "Address should be at least 10 characters long",
            },
          })}
        />
        {errors?.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        className="px-3 py-1.5 my-2 capitalize rounded-md bg-accent disabled:cursor-not-allowed disabled:opacity-30 hover:bg-accentDark text-white"
      >
        {title} Employee
      </button>
    </form>
  );
};

export default EmployeeForm;
