import React from "react";
import { useForm } from "react-hook-form";

const TicketResponseForm = ({
  ticket = {},
  closeModal = () => {},
  setRefetch = () => {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = React.useState(false);

  const sendResponse = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/tickets/${
          ticket._id
        }/response`,
        {
          method: "POST",
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
      onSubmit={handleSubmit(sendResponse)}
      className="w-full flex flex-col gap-3"
    >
      <h3 className="text-lg my-3">Ticket: {ticket?.title}</h3>
      <label htmlFor="response" className="text-sm font-semibold ">
        Response
      </label>
      <textarea
        rows={5}
        {...register("response", { required: true })}
        placeholder="Type your response here..."
        className={`w-full p-2 border border-neutral-500/50 bg-[var(--color-primary)] rounded-md outline-none focus:border-accent ${
          errors?.response && "!border-red-500"
        }`}
      />
      {errors.response && <p className="text-red-500">Response is required</p>}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || loading}
        className="w-full bg-accent text-white rounded-md py-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-none hover:bg-accentDark "
      >
        {loading ? "Sending..." : "Send Response"}
      </button>
    </form>
  );
};

export default TicketResponseForm;
