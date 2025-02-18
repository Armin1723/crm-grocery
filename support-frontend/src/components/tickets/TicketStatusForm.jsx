import React from "react";
import { useForm } from "react-hook-form";

const TicketStatusForm = ({
  ticket = {},
  closeModal = () => {},
  setRefetch = () => {},
}) => {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      status: ticket?.status || "new",
    },
  });

  const updateStatus = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/tickets/${ticket._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
      closeModal();
      setRefetch((prev) => !prev);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(updateStatus)}
      className="w-full flex flex-col gap-3"
    >
      <h3 className="text-lg my-3">Ticket: {ticket?.title}</h3>
      <label htmlFor="status" className="text-sm font-semibold">
        Status
      </label>
      <select
        {...register("status", { required: true })}
        className={`w-full p-2 border border-neutral-500/50 bg-[var(--color-primary)] rounded-md outline-none focus:border-accent ${
          errors?.status && "!border-red-500"
        }`}
      >
        <option value="new">New</option>
        <option value="open">Open</option>
        <option value="in progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
      {errors?.status && (
        <span className="text-red-500 text-sm">Status is required</span>
      )}
      <button
        type="submit"
        disabled={Object.keys(errors) > 0 || loading}
        className="button-primary mt-3 p-2 rounded-lg text-white bg-accent hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-none transition-all duration-200 ease-in"
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </form>
  );
};

export default TicketStatusForm;
