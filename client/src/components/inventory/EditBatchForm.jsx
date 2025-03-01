import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditBatchForm = ({
  batch = {},
  setRefetch = () => {},
  upid = "",
  closeModal = () => {},
}) => {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      sellingRate: batch.sellingRate,
      expiry: batch.expiry,
    },
  });

  const editBatch = async (values) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
              min:{
                value: batch.purchaseRate ? batch.purchaseRate : 0.01,
                message: "Selling rate should be greater than purchase rate"
              },
              max: {
                value: batch.mrp,
                message: "Selling rate should be less than or equal to MRP"
              },  
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

        <button
          type="submit"
          disabled={Object.keys(errors).length > 0 || loading}
          className="w-full px-3 py-1 disabled:opacity-30 disabled:cursor-not-allowed rounded-md bg-accent hover:bg-accentDark text-white cursor-pointer transition-all duration-300"
        >
          Edit Batch
        </button>
      </form>
    </div>
  );
};

export default EditBatchForm;
