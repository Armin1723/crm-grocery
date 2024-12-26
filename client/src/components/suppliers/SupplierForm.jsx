import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SupplierForm = ({
  supplier = [],
  title = "add",
  setRefetch = () => {},
  closeModal = () => {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: supplier?.name || "",
      email: supplier?.email || "",
      phone: supplier?.phone || "",
      address: supplier?.address || "",
      gstin: supplier?.gstin || "",
      pan: supplier?.pan || "",
      notes: supplier?.notes || "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const { name, email, phone, address, gstin, pan } = values;
      if (title === "add") {
        const newSupplier = {
          name,
          email,
          phone,
          address,
          gstin,
          pan,
          notes,
        };
        const response = await fetch("/api/suppliers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newSupplier),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        toast.success("Supplier added successfully");
        setRefetch((p) => !p);
        closeModal();
      } else {
        const updatedSupplier = {
          name,
          email,
          phone,
          address,
          gstin,
          pan,
          notes,
        };
        const response = await fetch(`/api/suppliers/${supplier._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedSupplier),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        toast.success("Supplier updated successfully");
        setRefetch((p) => !p);
        closeModal();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 h-full justify-end min-h-fit overflow-y-auto"
    >
      <div className="name-input w-full flex flex-col relative group my-2">
        <input
          type="text"
          placeholder=" "
          className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
            errors && errors.name && "border-red-500 focus:!border-red-500"
          }`}
          name="name"
          {...register("name", {
            required: "Name is required",
          })}
        />
        <label
          htmlFor="name"
          className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] ${
            errors && errors.name && "!text-red-500"
          }`}
        >
          Name*
        </label>
        {errors && errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="email-phone-group w-full flex max-sm:flex-col gap-4 max-sm:gap-2">
        <div className="email-input w-full flex flex-col relative group my-2">
          <input
            type="email"
            placeholder=" "
            className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
              errors && errors.email && "border-red-500 focus:!border-red-500"
            }`}
            name="email"
            {...register("email")}
          />
          <label
            htmlFor="email"
            className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.email && "!text-red-500"
            }`}
          >
            Email
          </label>
          {errors && errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="phone-input w-full flex flex-col relative group my-2">
          <input
            type="number"
            placeholder=" "
            className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
              errors && errors.phone && "border-red-500 focus:!border-red-500"
            }`}
            name="phone"
            {...register("phone", {
              required: "Phone Number is required",
              validate: (value) =>
                value.length === 10 || "Phone number should be 10 digits",
              valueAsNumber: true,
            })}
          />
          <label
            htmlFor="phone"
            className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-2 peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.phone && "!text-red-500"
            }`}
          >
            Phone
          </label>
        </div>
      </div>

      <div className="gstin-input w-full flex flex-col relative group my-2">
        <input
          type="number"
          placeholder=" "
          className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
            errors && errors.gstin && "border-red-500 focus:!border-red-500"
          }`}
          name="gstin"
          {...register("gstin")}
        />
        <label
          htmlFor="gstin"
          className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] ${
            errors && errors.gstin && "!text-red-500"
          }`}
        >
          GSTIN
        </label>
      </div>

      <div className="pan-input w-full flex flex-col relative group my-2">
        <input
          type="text"
          placeholder=" "
          className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
            errors && errors.pan && "border-red-500 focus:!border-red-500"
          }`}
          name="pan"
          {...register("pan")}
        />
        <label
          htmlFor="pan"
          className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] ${
            errors && errors.pan && "!text-red-500"
          }`}
        >
          PAN Number
        </label>
      </div>

      <div className="address-input w-full flex flex-col relative group my-2">
        <textarea
          type="number"
          placeholder=" "
          className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
            errors && errors.address && "border-red-500 focus:!border-red-500"
          }`}
          name="address"
          {...register("address")}
        />
        <label
          htmlFor="address"
          className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] ${
            errors && errors.address && "!text-red-500"
          }`}
        >
          Address
        </label>
      </div>

      <div className="notes-input w-full flex flex-col relative group my-2">
        <textarea
          rows={3}
          placeholder="Enter Notes (optional)"
          className={`outline-none placeholder:text-neutral-500 placeholder:text-xs placeholder:italic p-2 rounded-md border border-[var(--color-accent)] z-[5] bg-transparent transition-all duration-300 peer ${
            errors && errors.notes && "border-red-500 focus:!border-red-500"
          }`}
          name="notes"
          {...register("notes")}
        />
      </div>

      <button className="w-full py-1 rounded-md bg-accent hover:bg-accentDark text-white transition-all duration-300 capitalize">
        {title} supplier
      </button>
    </form>
  );
};

export default SupplierForm;
