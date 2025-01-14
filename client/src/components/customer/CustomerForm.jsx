import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CustomerForm = ({
  customer = null,
  setValue = () => {},
  closeModal = () => {},
  setRefetch = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(customer ? customer : null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: customerData?.name || "",
      email: customerData?.email || "",
      phone: customerData?.phone || "",
      address: customerData?.address || "",
    },
  });

  const fetchCustomer = async () => {
    if (getValues("phone").length == 10) {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/customers/${getValues(
            "phone"
          )}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          reset({
            name: "",
            email: "",
            phone: getValues("phone"),
            address: "",
          });
          throw new Error(data.message || "Failed to fetch customer");
        } else {
          setCustomerData(data.customer);
          reset(data.customer);
        }
      } catch (error) {
        console.error("Error fetching customer:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const addCustomer = async (values, event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/customers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );
      if(!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add customer");
        }
        toast.success("Customer added successfully");
        setValue("customerMobile", values.phone);
    } catch (error) {
      console.error("Error adding customer:", error.message);
    } finally {
      setLoading(false);
      setRefetch((p) => !p);
      reset();
      closeModal();
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(addCustomer)(e);
      }}
      className="flex flex-col gap-2 w-full py-4"
    >
      <div className="phone-email-group w-full flex flex-col lg:flex-row justify-center gap-4">
        <div className="phone-input w-full flex flex-col relative group my-2">
          <input
            type="number"
            placeholder=" "
            className={`input peer ${
              errors && errors.phone && "border-red-500 focus:!border-red-500"
            }`}
            name="phone"
            {...register("phone", {
              required: "Phone Number is required",
              validate: {
                isNumber: (value) =>
                  /^\d+$/.test(value) ||
                  "Phone number must contain only digits",
                length: (value) =>
                  value.length === 10 || "Phone number should be 10 digits",
              },
            })}
          />
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-3 z-[50]"
            onClick={fetchCustomer}
          >
            <span
              className={`w-3 h-3 cursor-pointer rounded-full border-b-2 border-t-2 border-accent ${
                loading && "animate-spin"
              }`}
            ></span>
          </div>
          <label
            htmlFor="phone"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.phone && "!text-red-500"
            }`}
          >
            Phone*
          </label>
          {errors && errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>

        <div className="email-input w-full flex flex-col relative group my-2">
          <input
            type="email"
            placeholder=" "
            className={`input peer ${
              errors && errors.email && "border-red-500 focus:!border-red-500"
            }`}
            name="email"
            {...register("email")}
          />
          <label
            htmlFor="email"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.email && "!text-red-500"
            }`}
          >
            Email
          </label>
          {errors && errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
      </div>

      <div className="name-address-group w-full flex flex-col lg:flex-row gap-4">
        <div className="name-input w-full flex flex-col relative group my-2">
          <input
            type="text"
            placeholder=" "
            className={`input peer ${
              errors && errors.name && "border-red-500 focus:!border-red-500"
            }`}
            name="name"
            {...register("name", {
              required: "Name is required",
            })}
          />
          <label
            htmlFor="name"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.name && "!text-red-500"
            }`}
          >
            Name*
          </label>
          {errors && errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="address-input w-full flex flex-col relative group my-2">
          <input
            type="text"
            placeholder=" "
            className={`input peer ${
              errors && errors.address && "border-red-500 focus:!border-red-500"
            }`}
            name="address"
            {...register("address")}
          />
          <label
            htmlFor="address"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.address && "!text-red-500"
            }`}
          >
            Address
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => addCustomer(getValues(), e)}
        disabled={Object.keys(errors).length > 0}
        className="rounded-md bg-accent hover:bg-accentDark disabled:opacity-30 disabled:hover:bg-gray-300 disabled:cursor-not-allowed text-white cursor-pointer px-3 py-1 w-full"
      >
        Save Customer
      </button>
    </form>
  );
};

export default CustomerForm;
