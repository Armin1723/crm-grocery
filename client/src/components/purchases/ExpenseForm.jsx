import React from "react";
import Divider from "../utils/Divider";
import { useForm } from "react-hook-form";
import { expenseTypes } from "../utils";
import { toast } from "react-toastify";

const ExpenseForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const addExpense = async (values) => {
    const id = toast.loading("Adding Expense...");
    try{
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/expenses`,
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(values),
            }
            );
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
        toast.update(id, {
            render: "Expense added successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000,
        });
        reset();
    } catch (error) {
        toast.update(id, {
            render: "Failed to add Expense",
            type: "error",
            isLoading: false,
            autoClose: 2000,
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(addExpense)} className="flex flex-col gap-3 flex-1">
      <Divider title="Expense Details" />
      <div className="amount-category w-full flex flex-col md:flex-row gap-2">
        <div className="amount-input w-full flex flex-col relative group my-2">
          <input
            type="number"
            placeholder=" "
            min={0}
            className={`input peer ${
              errors && errors.amount && "border-red-500 focus:!border-red-500 text-red-500"
            }`}
            name="amount"
            {...register("amount", { 
            valueAsNumber: true,
            validate: (value) => value > 0 || "Amount must be greater than 0"
             })}
          />
          <label
            htmlFor="amount"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.amount && "!text-red-500 border-red-500 "
            }`}
          >
            Amount*
          </label>
          {errors?.amount && (
            <span className="text-red-500 text-xs">
              {errors.amount.message}
            </span>
          )}
        </div>
        <div className="category-input w-full flex flex-col relative group my-2">
          <select
            className={`input peer bg-[var(--color-card)] ${
              errors && errors.amount && "border-red-500 focus:!border-red-500"
            }`}
            name="category"
            {...register("category", { required: "Category is required" })}
          >
            <option value="" className=" bg-[var(--color-card)]" disabled>
              Select Category
            </option>
            {expenseTypes.map((type) => {
              return (
                <option
                  key={type}
                  className=" bg-[var(--color-card)]"
                  value={type}
                >
                  {type}
                </option>
              );
            })}
          </select>
          <label
            htmlFor="category"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.category && "!text-red-500 border-red-500"
            }`}
          >
            Category*
          </label>
          {errors?.category && (
            <span className="text-red-500 text-xs">
              {errors.category.message}
            </span>
          )}
        </div>
      </div>
      <Divider title="Description" />
      <div className="flex-1">
        <textarea
          placeholder="Expense Description"
          className={`input w-full h-full peer placeholder:text-xs ${
            errors &&
            errors.description &&
            "border-red-500 focus:!border-red-500"
          }`}
          name="description"
          {...register("description")}
        />
      </div>
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        className="w-full rounded-md px-3 py-1 bg-accent hover:bg-accentDark cursor-pointer text-white disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
