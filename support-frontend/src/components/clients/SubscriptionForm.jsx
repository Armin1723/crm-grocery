import React from "react";
import { useForm } from "react-hook-form";
import Avatar from "../utils/Avatar";
import Divider from "../utils/Divider";
import { toast } from "react-toastify";

const SubscriptionForm = ({
  client = {},
  closeModal = () => {},
  setRefetch = () => {},
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Calculate one year from now.
  const todayPlusOneYear = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  );

  // Get the latest subscription end date
  const subsPlusOneYear = new Date(
    new Date(client?.company?.subscriptionEndDate).setFullYear(
      new Date(client?.company?.subscriptionEndDate).getFullYear() + 1
    )
  );

  // Get the latest date from the two dates
  const defaultEndDate = new Date(Math.max(subsPlusOneYear, todayPlusOneYear));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      subscription: "premium",
      subscriptionEndDate: defaultEndDate.toISOString().split("T")[0],
    },
  });

  const updateSubscription = async (values) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to update the subscription of ${client?.company?.name} to ${values.subscription} until ${values.subscriptionEndDate}?`
    );
  
    if (!isConfirmed) return;

    setLoading(true);
    setError(null); 

    const notifId = toast.loading("Updating subscription...");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/clients/${
          client._id
        }`,
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

      // Error handling for failed request
      if (!res.ok) {
        throw new Error(data.message || "Failed to update subscription");
      }
      toast.update(notifId, {
        render: "Subscription updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      closeModal();
      setRefetch((prev) => !prev);
    } catch (error) {
      setError(error.message);
      toast.update(notifId, {
        render: error.message || "Failed to update subscription",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      console.error("Error updating subscription:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(updateSubscription)}
      className="w-full flex flex-col gap-3"
    >
      <div className="company-details flex items-center gap-3">
        <Avatar image={client?.company?.logo} name={client?.company?.name} />
        <h3 className="text-lg my-3">{client?.company?.name}</h3>
      </div>
      <div className="subscription-details flex flex-col gap-2 text-sm text-[var(--color-text-light)]">
        <p className="capitalize">
          Subscription: {client?.company?.subscription || "Expired"}
        </p>
        <p>
          End Date:{" "}
          {new Date(client?.company?.subscriptionEndDate).toLocaleDateString()}
        </p>
      </div>

      <Divider title="Update Subscription" />

      {/* Subscription Type */}
      <label htmlFor="subscription" className="text-sm font-semibold">
        Subscription Plan
      </label>
      <select
        {...register("subscription", { required: true })}
        className={`w-full p-2 border border-neutral-500/50 bg-[var(--color-primary)] rounded-md outline-none focus:border-accent ${
          errors?.subscription && "!border-red-500"
        }`}
      >
        <option value="premium" selected>
          Premium
        </option>
      </select>
      {errors?.subscription && (
        <span className="text-red-500 text-sm">
          Subscription plan is required
        </span>
      )}

      {/* Subscription End Date */}
      <label
        htmlFor="subscriptionEndDate"
        className="text-sm font-semibold mt-3"
      >
        Subscription End Date
      </label>
      <input
        type="date"
        min={new Date().toISOString().split("T")[0]}
        {...register("subscriptionEndDate", { required: true })}
        className={`w-full p-2 border border-neutral-500/50 bg-[var(--color-primary)] rounded-md outline-none focus:border-accent ${
          errors?.subscriptionEndDate && "!border-red-500"
        }`}
      />
      {errors?.subscriptionEndDate && (
        <span className="text-red-500 text-sm">
          Subscription end date is required
        </span>
      )}

      {/* Display error messages */}
      {error && <span className="text-red-500 text-sm mt-3">{error}</span>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || loading}
        className="button-primary mt-3 p-2 rounded-lg text-white bg-accent hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-none transition-all duration-200 ease-in"
      >
        {loading ? "Updating..." : "Update Subscription"}
      </button>
    </form>
  );
};

export default SubscriptionForm;
