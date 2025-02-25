import React, { useState } from "react";
import { BiTime } from "react-icons/bi";
import { FaMoneyBillWave, FaCreditCard, FaPlus } from "react-icons/fa";
import { AiFillCheckCircle, AiFillWarning } from "react-icons/ai";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const PurchaseTimeline = ({
  purchase,
  closeModal = () => {},
  setRefetch = () => {},
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ amount: "", notes: "" });
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  // Calculate total amount paid
  const totalPaid =
    purchase.paidAmount +
    (purchase.followUpPayments.length > 0 && purchase.followUpPayments?.reduce(
      (sum, payment) => sum + payment?.paidAmount,
      0
    ) || 0);

  const remainingBalance = purchase.totalAmount - totalPaid;
  const isFullyPaid = remainingBalance <= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(newPayment.amount);

    if (amount > remainingBalance) {
      setError("Payment amount cannot exceed remaining balance");
      return;
    }

    if (amount <= 0) {
      setError("Payment amount must be greater than 0");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/purchases/${
          purchase._id
        }/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            paidAmount: amount,
            notes: newPayment.notes,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "An error occurred.");
      else {
        toast.show({
          message: "Payment added successfully",
          type: "success",
          autoClose: 3000,
        });
        closeModal();
        setRefetch((prev) => !prev);
        queryClient.invalidateQueries("purchases");
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    }

    setNewPayment({ amount: "", notes: "" });
    setIsFormOpen(false);
    setError("");
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setError("");
    setNewPayment({ amount: "", notes: "" });
  };

  return (
    <div className="max-w-full mx-auto p-6 space-y-8">
      {/* Header with Summary */}
      <div className="bg-[var(--color-primary)] border border-neutral-500/50 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl max-lg:text-lg max-sm:text-base font-bold">
            Payment Timeline
          </h2>
          <div className="flex items-center">
            {isFullyPaid ? (
              <AiFillCheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <AiFillWarning className="w-5 h-5 text-amber-500 mr-2" />
            )}
            <span
              className={`font-semibold ${
                isFullyPaid ? "text-green-500" : "text-amber-500"
              }`}
            >
              {isFullyPaid ? "Paid" : "Pending"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-[var(--color-card)] p-4 rounded-lg flex flex-col justify-between">
            <div className="text-neutral-500 mb-1">Total Amount</div>
            <div className="text-lg font-bold">₹{purchase.totalAmount}</div>
          </div>
          <div className="bg-[var(--color-card)] p-4 rounded-lg flex flex-col justify-between">
            <div className="text-neutral-500 mb-1">Total Paid</div>
            <div className="text-lg font-bold text-green-600">₹{totalPaid}</div>
          </div>
          <div className="bg-[var(--color-card)] p-4 rounded-lg flex flex-col justify-between">
            <div className="text-neutral-500 mb-1">Remaining Balance</div>
            <div className="text-lg font-bold text-amber-600">
              ₹{Math.max(0, remainingBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Items */}
      <div className="relative">
        {/* Initial Payment */}
        <div className="flex items-stretch ">
          <div className="flex flex-col items-center mr-4">
            <div className="rounded-full bg-accentDark p-2">
              <FaCreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="flex-grow w-0.5 bg-neutral-400 " />
          </div>
          <div className="flex-grow bg-[var(--color-primary)] border border-neutral-500/50 rounded-lg shadow-md p-4 my-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold bg-[var(--color-sidebar)] px-2 py-1 rounded">
                Initial Payment
              </span>
              <time className="text-sm flex items-center">
                <BiTime className="w-4 h-4 mr-1" />
                {new Date(purchase.createdAt).toLocaleString()}
              </time>
            </div>
            <div className="flex items-center mt-2">
              <FaMoneyBillWave className="w-4 h-4 text-green-500 mr-1" />
              <p className="font-semibold">₹{purchase.paidAmount}</p>
            </div>
          </div>
        </div>

        {/* Follow-up Payments */}
        {purchase.followUpPayments?.map((payment, index) => (
          <div className="flex items-stretch" key={index}>
            <div className="flex flex-col items-center mr-4 ">
              <div className="rounded-full bg-green-500 p-2">
                <FaCreditCard className="w-5 h-5 text-white" />
              </div>
              <div className={`flex-grow w-0.5 bg-neutral-400 ${index === purchase.followUpPayments.length - 1 && 'hidden'}`} />
            </div>
            <div className="flex-grow bg-[var(--color-primary)] my-2 border border-neutral-500/50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold bg-[var(--color-sidebar)] px-2 py-1 rounded">
                  Follow-up Payment {index + 1}
                </span>
                <time className="text-sm flex items-center">
                  <BiTime className="w-4 h-4 mr-1" />
                  {new Date(payment.createdAt).toLocaleString()}
                </time>
              </div>
              <div className="flex items-center mt-2">
                <FaMoneyBillWave className="w-4 h-4 text-green-500 mr-1" />
                <p className="font-semibold">₹{payment.paidAmount}</p>
              </div>
              {payment.notes && (
                <p className="mt-2 text-sm text-neutral-500 bg-[var(--color-card)] p-2 rounded">
                  {payment.notes}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Add Payment Button and Form */}
        {!isFullyPaid && (
          <>
            {!isFormOpen && (
              <div className="flex items-center">
                <div className="flex flex-col items-center mr-4">
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="rounded-full bg-accent p-2 hover:bg-accentDark/80 transition-colors cursor-pointer"
                  >
                    <FaPlus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {isFormOpen && (
              <div className="flex items-stretch mb-8">
                <div className="flex flex-col items-center mr-4">
                  <div className="rounded-full bg-accent p-2">
                    <FaPlus className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-grow bg-[var(--color-primary)] border border-neutral-500/50 rounded-lg shadow-md p-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        max={remainingBalance}
                        value={newPayment.amount}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            amount: e.target.value,
                          })
                        }
                        placeholder={`Maximum: ₹${remainingBalance}`}
                        className="w-full p-2 rounded-lg bg-[var(--color-card)] border border-neutral-500/50 focus:outline-none focus:ring-2 focus:ring-accentDark"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Notes</label>
                      <textarea
                        value={newPayment.notes}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Add payment notes..."
                        rows={3}
                        className="w-full p-2 rounded-lg bg-[var(--color-card)] border border-neutral-500/50 focus:outline-none focus:ring-2 focus:ring-accentDark"
                      />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-2 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-1.5 rounded-md border border-neutral-500/50 hover:bg-[var(--color-card)] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newPayment.amount}
                        className="px-4 py-1.5 rounded-md bg-accent hover:bg-accentDark/80 text-white transition-colors"
                      >
                        Add Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseTimeline;
