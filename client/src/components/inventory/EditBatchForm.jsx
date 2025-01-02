import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditBatchForm = ({
  batch = {},
  setRefetch = () => {},
  upid = "",
  closeModal = () => {},
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      sellingRate: batch.sellingRate,
      expiry: batch.expiry,
    },
  });

  const editBatch = async (values) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/${upid}/batches`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            oldBatch: {
              sellingRate: batch.sellingRate,
              expiry: batch.expiry,
            },
            newBatch: values,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setRefetch((prev) => !prev);
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 font-normal my-3">
      <form onSubmit={handleSubmit(editBatch)} className="flex flex-col gap-4">
        <div className="rate-input w-full flex flex-col relative group my-2">
          <input
            type="number"
            placeholder=" "
            className={`input peer ${
              errors && errors.sellingRate && "border-red-500 focus:!border-red-500 text-red-500"
            }`}
            name="sellingRate"
            {...register("sellingRate", {
              required: "sellingRate is required",
              valueAsNumber: true,
              validate: (value) => (value > batch?.purchaseRate && value <= batch?.mrp) || "Selling rate should be betweeen purchase rate and MRP",
            })}
          />
          <label
            htmlFor="sellingRate"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.sellingRate && "!text-red-500"
            }`}
          >
            Selling Rate*
          </label>
          {errors && errors.sellingRate && (
            <span className="text-red-500 text-sm">
              {errors.sellingRate.message}
            </span>
          )}
        </div>

        <div className="expiry-input w-full flex flex-col relative group my-2">
          <input
            type="date"
            className={`input peer ${
              errors && errors.expiry && "border-red-500 focus:!border-red-500"
            }`}
            name="expiry"
            defaultValue={
              batch.expiry
                ? new Date(batch.expiry).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              setValue("expiry", e.target.value);
            }}
            min={new Date().toISOString().split("T")[0]}
          />
          <label
            htmlFor="expiry"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.expiry && "!text-red-500"
            }`}
          >
            Expiry Date
          </label>
        </div>

        <button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className="w-full px-3 py-1 disabled:opacity-30 disabled:cursor-not-allowed rounded-md bg-accent hover:bg-accentDark text-white cursor-pointer transition-all duration-300"
        >
          Edit Batch
        </button>
      </form>
    </div>
  );
};

export default EditBatchForm;
