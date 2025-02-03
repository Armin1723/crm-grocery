import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormInput from "../utils/FormInput";
import { MdClose } from "react-icons/md";
import Divider from "../utils/Divider";
import { setUser } from "../../redux/features/user/userSlice";
import { useDispatch } from "react-redux";

const CompanyForm = ({
  company = {},
  title = "add",
  closeModal = () => {},
}) => {
  const [imagePreview, setImagePreview] = React.useState(company.logo || null);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      logo: company.logo || undefined,
      name: company.name || "",
      address: company.address || "",
      branch: company.branch || "",
      phone: company.phone || "",
      email: company.email || "",
      gstin: company.gstin || "",
      initials: company.initials || "",
      licenseKey: company.licenseKey || "",
    },
  });

  // Handle logo image change
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
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("logo", file);
    }
  };

  const addCompany = async (values) => {
    const id = toast.loading(
      `${title === "edit" ? "Updating" : "Adding"} company...`
    );
    const formData = new FormData();
    
    // Append all form fields to formData
    Object.keys(values).forEach(key => {
      if (values[key] !== undefined && values[key] !== '') {
        formData.append(key, values[key]);
      }
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/companies${
          title === "edit" ? "/" + company._id : ""
        }`,
        {
          method: title === "edit" ? "PUT" : "POST",
          body: formData,
          credentials: "include",
        }
    );
    
    const data = await response.json();
      if (!response.ok) {
        toast.update(id, {
          render: data.message || `Failed to ${title} company`,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(id, {
          render: `Company ${title === "edit" ? "updated" : "added"} successfully`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        if (title === "add") {
          reset();
          setImagePreview(null);
        } else {
          closeModal();
        }
        dispatch(setUser(data?.user));
      }
    } catch (error) {
      toast.update(id, {
        render: error.message || `Failed to ${title} company`,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(addCompany)}
      className="flex flex-col gap-2 w-full flex-1 min-h-[60vh] px-3 max-sm:px-1 space-y-2"
    >
      {/* Logo Upload */}
      <div className="space-y-2">
        <label htmlFor="image" className="my-2 font-semibold">Company Logo</label>
        <div className="border-2 border-dashed border-neutral-500/50 rounded-lg p-4 text-center relative">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto max-h-48 object-contain"
              />
              <div
                className="absolute top-2 right-2 cursor-pointer hover:opacity-75"
                onClick={() => {
                  setImagePreview(null);
                  setValue("logo", null);
                }}
              >
                <MdClose />
              </div>
            </div>
          ) : (
            <div 
              onClick={() => document.querySelector('#logo-upload').click()} 
              className="h-48 cursor-pointer flex items-center justify-center bg-[var(--color-card)] rounded-lg"
            >
              <span className="text-gray-500">Click to upload logo</span>
            </div>
          )}
          <input
            type="file"
            id="logo-upload"
            accept="image/*"
            className="w-full py-2"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <Divider title="Basic Information" />

      <div className="name-initials-group flex max-sm:flex-col gap-4 max-sm:gap-2 w-full">
        {/* Company Name Input */}
        <FormInput
          label="Company Name"
          error={errors.name}
          otherClasses="w-1/2 max-sm:w-full"
          withAsterisk
        >
          <input
            type="text"
            placeholder="Company Name"
            readOnly={title === "edit"}
            className={`input peer ${errors.name && "border-red-500 focus:!border-red-500"}`}
            {...register("name", {
              required: "Company name is required",
            })}
          />
        </FormInput>

        {/* Initials Input */}
        <FormInput
          label="Company Initials"
          readOnly={title === "edit"}
          error={errors.initials}
          otherClasses="w-1/2 max-sm:w-full"
          withAsterisk
        >
          <input
            type="text"
            placeholder="Company Initials"
            className={`input peer ${errors.initials && "border-red-500 focus:!border-red-500"}`}
            {...register("initials", {
              required: "Company initials are required",
            })}
          />
        </FormInput>
      </div>

        {/* Branch Input */}
        <FormInput
          label="Branch"
          error={errors.branch}
          otherClasses="w-full"
          withAsterisk
        >
          <input
            type="text"
            placeholder="Branch Name"
            className={`input peer ${errors.branch && "border-red-500 focus:!border-red-500"}`}
            {...register("branch", {
              required: "Branch is required",
            })}
          />
        </FormInput>

      <Divider title="Contact Information" />

      <div className="contact-group flex max-sm:flex-col gap-4 max-sm:gap-2 w-full">
        {/* Email Input */}
        <FormInput
          label="Email"
          error={errors.email}
          otherClasses="w-1/2 max-sm:w-full"
          withAsterisk
        >
          <input
            type="email"
            placeholder="Email Address"
            className={`input peer ${errors.email && "border-red-500 focus:!border-red-500"}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        </FormInput>

        {/* Phone Input */}
        <FormInput
          label="Phone"
          error={errors.phone}
          otherClasses="w-1/2 max-sm:w-full"
          withAsterisk
        >
          <input
            type="tel"
            placeholder="Phone Number"
            className={`input peer ${errors.phone && "border-red-500 focus:!border-red-500"}`}
            {...register("phone", {
              required: "Phone number is required",
            })}
          />
        </FormInput>
      </div>

      {/* Address Input */}
      <FormInput
        label="Address"
        error={errors.address}
        withAsterisk
      >
        <textarea
          placeholder="Company Address"
          rows={3}
          className={`input peer ${errors.address && "border-red-500 focus:!border-red-500"}`}
          {...register("address", {
            required: "Address is required",
          })}
        />
      </FormInput>

      <Divider title="Business Information" />

      {/* GSTIN Input */}
      <FormInput
        label="GSTIN"
        error={errors.gstin}
      >
        <input
          type="text"
          placeholder="GSTIN Number"
          className={`input peer ${errors.gstin && "border-red-500 focus:!border-red-500"}`}
          {...register("gstin")}
        />
      </FormInput>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        className="px-3 py-1.5 my-2 capitalize rounded-md bg-accent disabled:cursor-not-allowed disabled:opacity-30 hover:bg-accentDark text-white"
      >
        {title} Company
      </button>
    </form>
  );
};

export default CompanyForm;